import { ANATOMICAL_SYSTEMS, MODEL_PATH } from './constants.js';
import { initUI, createHotspotDOM, updateHotspotsPosition, setProgress, hideLoading, clearHotspotsDOM } from './ui.js';
import { initScene, loadScript } from './scene.js';

// ─── STATE ────────────────────────────────────────────────────────────────
let isDragging = false, prevX = 0, prevY = 0;
let sph = { theta: Math.PI / 4, phi: Math.PI / 3, r: 5 };
const target = new THREE.Vector3();
let horseModel = null;
const modelBox = new THREE.Box3();
let currentSystemId = 'exterior';
let HOTSPOTS_3D = [];

// ─── CAMERA ANIMATION STATE ───────────────────────────────────────────────
// Smooth camera transitions: when animating, we lerp both target and sph.r
const camAnim = {
  active: false,
  targetFrom: new THREE.Vector3(),
  targetTo: new THREE.Vector3(),
  rFrom: 5,
  rTo: 5,
  progress: 0,
  duration: 0.55 // seconds
};

// Easing: smooth-in-out cubic
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function startCameraFocus(newTarget, newR) {
  camAnim.targetFrom.copy(target);
  camAnim.targetTo.copy(newTarget);
  camAnim.rFrom = sph.r;
  camAnim.rTo = newR != null ? newR : sph.r * 0.55;
  camAnim.progress = 0;
  camAnim.active = true;
  // Stop auto-rotation briefly so the animation feels intentional
  autoRotate = false;
  setTimeout(() => { autoRotate = true; }, 2200);
}

let autoRotate = true;
let lastFrameTime = performance.now();

// ─── INITIALIZATION ───────────────────────────────────────────────────────
const isMobileDevice = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
if (isMobileDevice) {
  console.log('[Optimizacion Movil] Activada. Aplicando recortes de renderizado y logica agresiva...');
}

// ─── RAYCASTER ───────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();

function screenToNDC(clientX, clientY) {
  return new THREE.Vector2(
    (clientX / window.innerWidth) * 2 - 1,
    -(clientY / window.innerHeight) * 2 + 1
  );
}

function focusOnPoint(clientX, clientY, camera) {
  if (!horseModel) return;
  raycaster.setFromCamera(screenToNDC(clientX, clientY), camera);
  const meshes = [];
  horseModel.traverse(c => { if (c.isMesh && c.visible) meshes.push(c); });
  const hits = raycaster.intersectObjects(meshes, false);
  if (hits.length === 0) return;

  const hitPoint = hits[0].point;
  // Focus distance: zoom in to ~35% of current orbital radius, min 1.5 units
  const focusR = Math.max(1.5, sph.r * 0.35);
  startCameraFocus(hitPoint, focusR);
  showFocusRipple(clientX, clientY);
}

// ─── FOCUS RIPPLE VISUAL FEEDBACK ────────────────────────────────────────
function showFocusRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'focus-ripple';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

function loadSystem(sysId) {
  currentSystemId = sysId;
  clearHotspotsDOM();
  const sys = ANATOMICAL_SYSTEMS[currentSystemId];
  if (!sys || !sys.hotspots) {
    HOTSPOTS_3D = [];
    return;
  }
  HOTSPOTS_3D = sys.hotspots.map(h => ({ ...h, pos: new THREE.Vector3() }));
  
  if (!modelBox.isEmpty()) {
    fitHotspots(modelBox);
  }
  HOTSPOTS_3D.forEach(hs => createHotspotDOM(hs, currentSystemId, onHotspotFocus));
  updateModelVisibility();
}

// ─── HOTSPOT FOCUS CALLBACK (Option 3) ───────────────────────────────────
function onHotspotFocus(hotspotId) {
  const hs = HOTSPOTS_3D.find(h => h.id === hotspotId);
  if (!hs) return;
  // Zoom in tighter for a hotspot, keeping a comfortable viewing distance
  const focusR = Math.max(1.5, sph.r * 0.45);
  startCameraFocus(hs.pos, focusR);
}

function updateModelVisibility() {
  if (!horseModel) return;
  
  horseModel.traverse(child => {
    if (child.isMesh && !child.name.startsWith('Cylinder')) {
      let shouldBeVisible = true;
      const lowerName = child.name.toLowerCase();
      
      if (currentSystemId === 'esqueleto') {
        shouldBeVisible = lowerName.includes('esqueleto') || lowerName.includes('skeleton') || lowerName.includes('bone') || lowerName.includes('hueso');
      } else if (currentSystemId === 'muscular') {
        shouldBeVisible = lowerName.includes('musculo') || lowerName.includes('muscle') || lowerName.includes('muscular');
      } else if (currentSystemId === 'exterior') {
        shouldBeVisible = !lowerName.includes('esqueleto') && !lowerName.includes('skeleton') && !lowerName.includes('bone') && !lowerName.includes('hueso') && !lowerName.includes('musculo') && !lowerName.includes('muscle') && !lowerName.includes('muscular');
        
        // Mobile optimization overrides for Exterior view
        if (isMobileDevice && shouldBeVisible) {
          const allowedMeshes = ['cabello_caballo', 'ZBrush_defualt_group010', 'pelaje'];
          if (!allowedMeshes.includes(child.name)) {
            shouldBeVisible = false;
          }
        }
      }

      child.visible = shouldBeVisible;

      // Sync DevTools checkboxes if present
      const devMeshList = document.getElementById('dev-mesh-list');
      if (devMeshList) {
        const labels = devMeshList.querySelectorAll('.dev-mesh-item');
        labels.forEach(lbl => {
          if (lbl.textContent.trim() === child.name) {
            const cb = lbl.querySelector('input[type="checkbox"]');
            if (cb) cb.checked = child.visible;
          }
        });
      }
    }
  });
}

initUI((sysId) => {
  loadSystem(sysId);
});
const { renderer, scene, camera, keyLight, fillLight, backLight, bottomLight, gridHelper, ground } = initScene();

function updateCamera() {
  camera.position.set(
    target.x + sph.r * Math.sin(sph.phi) * Math.sin(sph.theta),
    target.y + sph.r * Math.cos(sph.phi),
    target.z + sph.r * Math.sin(sph.phi) * Math.cos(sph.theta)
  );
  camera.lookAt(target);
}
updateCamera();

function fitHotspots(box) {
  if (box.isEmpty()) return;
  const size = new THREE.Vector3();
  box.getSize(size);
  const sys = ANATOMICAL_SYSTEMS[currentSystemId];
  if (!sys || !sys.hotspots) return;
  sys.hotspots.forEach((hf, i) => {
    if (HOTSPOTS_3D[i]) {
      HOTSPOTS_3D[i].pos.set(
        box.min.x + hf.frac[0] * size.x,
        box.min.y + hf.frac[1] * size.y,
        box.min.z + hf.frac[2] * size.z
      );
    }
  });
}

// Initial load
loadSystem(currentSystemId);

// ─── EVENTS ───────────────────────────────────────────────────────────────
const container = document.getElementById('canvas-container');

// ── Double-click to focus (Option 2 - Desktop) ────────────────────────────
let lastClickTime = 0;
container.addEventListener('click', e => {
  const now = performance.now();
  if (now - lastClickTime < 320) {
    // Double-click detected
    focusOnPoint(e.clientX, e.clientY, camera);
  }
  lastClickTime = now;
});

// ── Drag to rotate ────────────────────────────────────────────────────────
container.addEventListener('mousedown', e => { 
  isDragging = true; 
  prevX = e.clientX; 
  prevY = e.clientY; 
});
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  camAnim.active = false; // Cancel any ongoing animation on manual drag
  sph.theta -= (e.clientX - prevX) * 0.006;
  sph.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sph.phi - (e.clientY - prevY) * 0.006));
  prevX = e.clientX; prevY = e.clientY;
  updateCamera();
});

container.addEventListener('wheel', e => {
  camAnim.active = false;
  sph.r = Math.max(0.5, Math.min(200, sph.r + e.deltaY * 0.02));
  updateCamera();
}, { passive: true });

// ── Touch events ──────────────────────────────────────────────────────────
let lastTouch = null;
let lastTapTime = 0;
let lastTapPos = null;

container.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    lastTouch = e.touches[0];

    // Double-tap detection (Option 2 - Mobile)
    const now = performance.now();
    const t = e.touches[0];
    if (lastTapPos && now - lastTapTime < 320) {
      const dx = t.clientX - lastTapPos.x;
      const dy = t.clientY - lastTapPos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 30) {
        // Double tap confirmed
        focusOnPoint(t.clientX, t.clientY, camera);
        lastTapTime = 0;
        return;
      }
    }
    lastTapTime = now;
    lastTapPos = { x: t.clientX, y: t.clientY };
  }
}, { passive: true });

container.addEventListener('touchmove', e => {
  if (e.touches.length === 1 && lastTouch) {
    camAnim.active = false;
    const t = e.touches[0];
    sph.theta -= (t.clientX - lastTouch.clientX) * 0.008;
    sph.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sph.phi - (t.clientY - lastTouch.clientY) * 0.008));
    lastTouch = t;
    updateCamera();
  }
}, { passive: true });

container.addEventListener('touchend', () => { lastTouch = null; }, { passive: true });

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
if (zoomInBtn) {
  zoomInBtn.addEventListener('click', () => {
    camAnim.active = false;
    sph.r = Math.max(0.5, sph.r - 2.0);
    updateCamera();
  });
}
if (zoomOutBtn) {
  zoomOutBtn.addEventListener('click', () => {
    camAnim.active = false;
    sph.r = Math.min(200, sph.r + 2.0);
    updateCamera();
  });
}

const devHeader = document.getElementById('dev-header');
if (devHeader) {
  devHeader.addEventListener('click', () => {
    const list = document.getElementById('dev-mesh-list');
    const toggle = document.getElementById('dev-tools-toggle');
    if (list.style.display === 'none') {
      list.style.display = 'block';
      toggle.textContent = '▼';
    } else {
      list.style.display = 'none';
      toggle.textContent = '▶';
    }
  });
}

window.enableDevTools = function() {
  const panel = document.getElementById('dev-tools-panel');
  if (panel) {
    panel.style.display = 'flex';
    console.log('Dev Tools activadas. El panel ahora es visible.');
  }
};
window.disableDevTools = function() {
  const panel = document.getElementById('dev-tools-panel');
  if (panel) {
    panel.style.display = 'none';
    console.log('Dev Tools desactivadas. El panel ahora esta oculto.');
  }
};
console.log('Escribe enableDevTools() o disableDevTools() en la consola para controlar las herramientas de desarrollo.');

// ─── RENDER LOOP ──────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const delta = Math.min((now - lastFrameTime) / 1000, 0.1); // cap delta at 100ms
  lastFrameTime = now;

  // ── Camera animation step ──────────────────────────────────────────────
  if (camAnim.active) {
    camAnim.progress += delta / camAnim.duration;
    if (camAnim.progress >= 1) {
      camAnim.progress = 1;
      camAnim.active = false;
    }
    const t = easeInOutCubic(camAnim.progress);
    target.lerpVectors(camAnim.targetFrom, camAnim.targetTo, t);
    sph.r = camAnim.rFrom + (camAnim.rTo - camAnim.rFrom) * t;
    updateCamera();
  } else if (autoRotate) {
    sph.theta += 0.0008;
    updateCamera();
  }

  renderer.render(scene, camera);
  updateHotspotsPosition(HOTSPOTS_3D, camera);
}

// ─── LOAD MODEL ───────────────────────────────────────────────────────────
setProgress(10, 'Cargando bibliotecas 3D...');

loadScript('https://unpkg.com/three@0.128.0/examples/js/loaders/GLTFLoader.js')
  .then(() => {
    setProgress(25, 'Cargando caballo.glb...');
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
        setProgress(85, 'Ajustando escena...');
        const model = gltf.scene;
        const devMeshList = document.getElementById('dev-mesh-list');
        if (devMeshList) devMeshList.innerHTML = '';

        model.traverse(child => {
          if (child.isMesh) {
            if (child.name.startsWith('Cylinder')) child.visible = false;
            // Logica para poblar el Dev Tools Panel
            if (devMeshList && !child.name.startsWith('Cylinder')) {
               const lbl = document.createElement('label');
               lbl.className = 'dev-mesh-item';
               
               const cb = document.createElement('input');
               cb.type = 'checkbox';
               
               cb.checked = child.visible;
               cb.onchange = (e) => {
                 child.visible = e.target.checked;
               };
               
               lbl.appendChild(cb);
               lbl.appendChild(document.createTextNode(child.name || 'Malla sin nombre'));
               devMeshList.appendChild(lbl);
            }

            if (child.material) {
              if (child.material.map) child.material.map.encoding = THREE.sRGBEncoding;
              // Optimizacion extra para moviles: Apagar mapas pesados del material
              if (isMobileDevice) {
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
        updateModelVisibility(); // Apply visibility logic now that model is loaded

        setProgress(100, 'Listo.');
        setTimeout(hideLoading, 400);
        animate();
      },
      (xhr) => {
        if (xhr.total) {
          const pct = 25 + Math.round((xhr.loaded / xhr.total) * 58);
          setProgress(pct, `Cargando... ${Math.round(xhr.loaded / 1024)} KB`);
        }
      },
      (err) => {
        console.error('Error cargando caballo.glb:', err);
        setProgress(0, 'No se pudo cargar caballo.glb');
      }
    );
  })
  .catch(err => {
    console.error('Error cargando bibliotecas:', err);
    setProgress(0, 'Error al cargar bibliotecas 3D.');
  });
