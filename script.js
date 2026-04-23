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
let _initialR = 5; // Set after model loads; used as reference for zoom limits
let devToolsActive = false; // Flag for developer mode interactions

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
  // Pause auto-rotation while animation plays + a short grace period
  pauseAutoRotate(2500);
}

// ─── AUTO-ROTATE CONTROL ─────────────────────────────────────────────────
// autoRotateEnabled: permanent user preference (toggled via button)
// autoRotatePaused:  temporary pause after zoom interaction
let autoRotateEnabled = true;
let autoRotatePaused = false;
let autoRotatePauseTimer = null;
let lastFrameTime = performance.now();

// Returns true only when both flags allow rotation
function shouldAutoRotate() {
  return autoRotateEnabled && !autoRotatePaused;
}

// Pause rotation for `ms` milliseconds (resets the timer on repeated calls)
function pauseAutoRotate(ms) {
  autoRotatePaused = true;
  if (autoRotatePauseTimer) clearTimeout(autoRotatePauseTimer);
  autoRotatePauseTimer = setTimeout(() => {
    autoRotatePaused = false;
    autoRotatePauseTimer = null;
  }, ms);
}

function syncRotateBtn() {
  const btn = document.getElementById('rotate-toggle-btn');
  if (!btn) return;
  const icon = btn.querySelector('.rotate-btn-icon');
  if (autoRotateEnabled) {
    btn.classList.remove('rotate-off');
    btn.title = 'Detener rotacion';
    if (icon) icon.style.animationPlayState = 'running';
  } else {
    btn.classList.add('rotate-off');
    btn.title = 'Activar rotacion';
    if (icon) icon.style.animationPlayState = 'paused';
  }
}

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

function logDevCoordinates(clientX, clientY) {
  if (!horseModel || !modelBox) return;
  raycaster.setFromCamera(screenToNDC(clientX, clientY), camera);
  const meshes = [];
  horseModel.traverse(c => { if (c.isMesh && c.visible) meshes.push(c); });
  const hits = raycaster.intersectObjects(meshes, false);
  
  if (hits.length > 0) {
    const P = hits[0].point;
    const size = new THREE.Vector3();
    modelBox.getSize(size);
    
    // Calculate fractional coordinates [0, 1] relative to the bounding box
    const fracX = parseFloat(((P.x - modelBox.min.x) / size.x).toFixed(3));
    const fracY = parseFloat(((P.y - modelBox.min.y) / size.y).toFixed(3));
    const fracZ = parseFloat(((P.z - modelBox.min.z) / size.z).toFixed(3));
    
    const hotspotName = prompt("Nombre para este Hotspot (ej: cabeza, pulmon_izq):");
    if (hotspotName !== null) {
      const cleanName = hotspotName.trim().toLowerCase().replace(/\s+/g, '_');
      const id = `${currentSystemId}_${cleanName}`;
      
      const hotspotJSON = {
        id: id,
        frac: [fracX, fracY, fracZ],
        key: hotspotName.trim()
      };

      console.log(`%c [Dev Tool] Hotspot Creado:`, "color: #f59e0b; font-weight: bold; font-size: 1.2em;");
      console.log(JSON.stringify(hotspotJSON, null, 2));
      console.log(`%c Copia este objeto y pégalo en el array 'hotspots' de '${currentSystemId}' en constants.js`, "color: #a1a1aa; font-style: italic;");
      
      // Visual feedback
      showFocusRipple(clientX, clientY);
    }
  }
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
      
      const sys = ANATOMICAL_SYSTEMS[currentSystemId];
      if (currentSystemId === 'esqueleto') {
        shouldBeVisible = lowerName.includes('esqueleto') || lowerName.includes('skeleton') || lowerName.includes('bone') || lowerName.includes('hueso');
      } else if (currentSystemId === 'muscular') {
        shouldBeVisible = lowerName.includes('musculo') || lowerName.includes('muscle') || lowerName.includes('muscular');
      } else if (sys && sys.meshNames) {
        // Generic mesh-name-based filter for systems that declare meshNames (e.g. respiratorio, bronquios)
        shouldBeVisible = sys.meshNames.some(n => lowerName.includes(n.toLowerCase()));
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
  
  // Dev mode interaction: capture coordinates for hotspots
  if (devToolsActive) {
    logDevCoordinates(e.clientX, e.clientY);
  }

  if (now - lastClickTime < 320) {
    // Double-click detected: focus on point
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
  camAnim.active = false;
  sph.theta -= (e.clientX - prevX) * 0.006;
  sph.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sph.phi - (e.clientY - prevY) * 0.006));
  prevX = e.clientX; prevY = e.clientY;
  // Pause auto-rotate while the user is manually rotating
  pauseAutoRotate(3000);
  updateCamera();
});

container.addEventListener('wheel', e => {
  camAnim.active = false;
  // Proportional zoom: factor scales with distance
  const zoomFactor = sph.r * 0.08;
  const delta = e.deltaY > 0 ? zoomFactor : -zoomFactor;
  const minR = Math.max(0.4, sph.r * 0.05);  // can't get closer than 5% of current r
  sph.r = Math.max(minR, Math.min(300, sph.r + delta));
  updateCamera();
  // Pause auto-rotation for 10 seconds on zoom
  pauseAutoRotate(10000);
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
    pauseAutoRotate(3000);
    updateCamera();
  } else if (e.touches.length === 2) {
    // Pinch-to-zoom
    camAnim.active = false;
    const d = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    if (_lastPinchDist > 0) {
      const ratio = _lastPinchDist / d;
      const zoomFactor = sph.r * 0.08;
      sph.r = Math.max(0.4, Math.min(300, sph.r * ratio));
      updateCamera();
      pauseAutoRotate(10000);
    }
    _lastPinchDist = d;
  }
}, { passive: true });

container.addEventListener('touchend', e => {
  if (e.touches.length < 2) _lastPinchDist = 0;
}, { passive: true });

let _lastPinchDist = 0;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ─── ZOOM BUTTONS (proportional + relative limits) ───────────────────────
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');

function doZoom(direction) {
  camAnim.active = false;
  // Step is 18% of current distance — closer = smaller step, farther = larger step
  const step = sph.r * 0.18;
  if (direction < 0) {
    // Zoom in: minimum is 15% of the initial loaded radius or 0.4, whichever is greater
    const minR = Math.max(0.4, _initialR * 0.12);
    sph.r = Math.max(minR, sph.r - step);
  } else {
    // Zoom out: maximum is 3x the initial loaded radius
    const maxR = _initialR * 3.0;
    sph.r = Math.min(maxR, sph.r + step);
  }
  pauseAutoRotate(10000);
  updateCamera();
}

if (zoomInBtn)  zoomInBtn.addEventListener('click',  () => doZoom(-1));
if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => doZoom(+1));

// ─── ROTATE TOGGLE BUTTON ─────────────────────────────────────────────────
const rotateToggleBtn = document.getElementById('rotate-toggle-btn');
if (rotateToggleBtn) {
  rotateToggleBtn.addEventListener('click', () => {
    autoRotateEnabled = !autoRotateEnabled;
    // If re-enabling, clear any pending pause timer
    if (autoRotateEnabled && autoRotatePauseTimer) {
      clearTimeout(autoRotatePauseTimer);
      autoRotatePauseTimer = null;
      autoRotatePaused = false;
    }
    syncRotateBtn();
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
    devToolsActive = true;
    console.log('%c Dev Tools activadas. Click sobre el modelo para obtener coordenadas.', "color: #f59e0b; font-weight: bold;");
  }
};
window.disableDevTools = function() {
  const panel = document.getElementById('dev-tools-panel');
  if (panel) {
    panel.style.display = 'none';
    devToolsActive = false;
    console.log('Dev Tools desactivadas.');
  }
};
window.admin = function(command) {
  if (command === "/gamemode 1") {
    window.enableDevTools();
  } else if (command === "/gamemode 0") {
    window.disableDevTools();
  } else {
    console.log("Comando no reconocido. Prueba con admin('/gamemode 1')");
  }
};
console.log('Escribe admin("/gamemode 1") en la consola para activar las herramientas de desarrollo.');


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
  } else if (shouldAutoRotate()) {
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
        _initialR = sph.r; // Store initial radius for zoom limits
        camera.near = diag * 0.001;
        camera.far  = diag * 30;
        camera.updateProjectionMatrix();
        updateCamera();
        syncRotateBtn(); // Initialize button state

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
