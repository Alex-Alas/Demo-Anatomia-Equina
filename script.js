import { HOTSPOT_FRACS, MODEL_PATH } from './constants.js';
import { initUI, createHotspotDOM, updateHotspotsPosition, setProgress, hideLoading } from './ui.js';
import { initScene, loadScript } from './scene.js';

// ─── STATE ────────────────────────────────────────────────────────────────
let isDragging = false, prevX = 0, prevY = 0;
let sph = { theta: Math.PI / 4, phi: Math.PI / 3, r: 5 };
const target = new THREE.Vector3();
let horseModel = null;
const modelBox = new THREE.Box3();
const HOTSPOTS_3D = HOTSPOT_FRACS.map(h => ({ ...h, pos: new THREE.Vector3() }));

// ─── INITIALIZATION ───────────────────────────────────────────────────────
initUI();
const { renderer, scene, camera, keyLight, fillLight, backLight, bottomLight, gridHelper, ground } = initScene();

function updateCamera() {
  camera.position.set(
    target.x + sph.r * Math.sin(sph.phi) * Math.sin(sph.theta),
    target.y + sph.r * -Math.cos(sph.phi),
    target.z + sph.r * Math.sin(sph.phi) * Math.cos(sph.theta)
  );
  camera.lookAt(target);
}
updateCamera();

function fitHotspots(box) {
  const size = new THREE.Vector3();
  box.getSize(size);
  HOTSPOT_FRACS.forEach((hf, i) => {
    HOTSPOTS_3D[i].pos.set(
      box.min.x + hf.frac[0] * size.x,
      box.min.y + hf.frac[1] * size.y,
      box.min.z + hf.frac[2] * size.z
    );
  });
}

// ─── EVENTS ───────────────────────────────────────────────────────────────
const container = document.getElementById('canvas-container');

container.addEventListener('mousedown', e => { 
  isDragging = true; 
  prevX = e.clientX; 
  prevY = e.clientY; 
});
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  sph.theta -= (e.clientX - prevX) * 0.006;
  sph.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sph.phi + (e.clientY - prevY) * 0.006));
  prevX = e.clientX; prevY = e.clientY;
  updateCamera();
});

container.addEventListener('wheel', e => {
  sph.r = Math.max(0.5, Math.min(200, sph.r + e.deltaY * 0.02));
  updateCamera();
}, { passive: true });

let lastTouch = null;
container.addEventListener('touchstart', e => { lastTouch = e.touches[0]; });
container.addEventListener('touchmove', e => {
  if (!lastTouch) return;
  const t = e.touches[0];
  sph.theta -= (t.clientX - lastTouch.clientX) * 0.008;
  sph.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sph.phi + (t.clientY - lastTouch.clientY) * 0.008));
  lastTouch = t; updateCamera();
}, { passive: true });

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ─── HOTSPOTS ─────────────────────────────────────────────────────────────
HOTSPOTS_3D.forEach(hs => createHotspotDOM(hs));

// ─── RENDER LOOP ──────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  if (!isDragging) { sph.theta += 0.0008; updateCamera(); }
  renderer.render(scene, camera);
  updateHotspotsPosition(HOTSPOTS_3D, camera);
}

// ─── LOAD MODEL ───────────────────────────────────────────────────────────
setProgress(10, "Cargando bibliotecas 3D…");

loadScript('https://unpkg.com/three@0.128.0/examples/js/loaders/GLTFLoader.js')
  .then(() => {
    setProgress(25, "Cargando caballo.glb…");
    const loader = new THREE.GLTFLoader();

    loadScript('https://unpkg.com/three@0.128.0/examples/js/loaders/DRACOLoader.js')
      .then(() => {
        try {
          const draco = new THREE.DRACOLoader();
          draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');
          loader.setDRACOLoader(draco);
        } catch(e) {}
      }).catch(() => {});

    loader.load(
      MODEL_PATH,
      (gltf) => {
        setProgress(85, "Ajustando escena…");
        const model = gltf.scene;
        model.traverse(child => {
          if (child.isMesh) {
            if (child.name.startsWith('Cylinder')) child.visible = false;
            if (child.material) {
              if (child.material.map) child.material.map.encoding = THREE.sRGBEncoding;
              // Optimizacion extra para móviles: Apagar mapas pesados del material
              if (window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent)) {
                if (child.material.normalMap) child.material.normalMap = null;
                if (child.material.roughnessMap) child.material.roughnessMap = null;
                if (child.material.metalnessMap) child.material.metalnessMap = null;
              }
            }
          }
        });
        scene.add(model);

        const box1 = new THREE.Box3().setFromObject(model);
        const center1 = new THREE.Vector3();
        box1.getCenter(center1);
        model.position.set(-center1.x, -box1.min.y, -center1.z);

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        const floorY = box.min.y - 0.002;
        ground.position.y = floorY;
        gridHelper.position.y = floorY;

        const footprint = Math.max(size.x, size.z) * 2.5;
        ground.scale.set(footprint / 20, 1, footprint / 20);
        gridHelper.scale.set(footprint / 20, 1, footprint / 20);

        const diag = size.length();
        scene.fog = new THREE.Fog(0x0d0f0e, diag * 3, diag * 8);

        target.copy(center);
        sph.r = diag * 1.2;
        camera.near = diag * 0.001;
        camera.far  = diag * 30;
        camera.updateProjectionMatrix();
        updateCamera();

        keyLight.position.set(diag * 1.2, diag * 2, diag);
        fillLight.position.set(-diag, diag, diag);
        backLight.position.set(0, diag, -diag);
        bottomLight.position.set(0, -diag, 0);

        horseModel = model;
        modelBox.copy(box);
        fitHotspots(box);

        setProgress(100, "Listo.");
        setTimeout(hideLoading, 400);
        animate();
      },
      (xhr) => {
        if (xhr.total) {
          const pct = 25 + Math.round((xhr.loaded / xhr.total) * 58);
          setProgress(pct, `Cargando… ${Math.round(xhr.loaded / 1024)} KB`);
        }
      },
      (err) => {
        console.error('Error cargando caballo.glb:', err);
        setProgress(0, '✕ No se pudo cargar caballo.glb');
      }
    );
  })
  .catch(err => {
    console.error('Error cargando bibliotecas:', err);
    setProgress(0, '✕ Error al cargar bibliotecas 3D.');
  });
