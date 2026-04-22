export function initScene() {
  const container = document.getElementById('canvas-container');
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0f0e);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  
  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(5, 5, 10);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
  fillLight.position.set(-5, 5, 5);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(0, 5, -10);
  scene.add(backLight);

  const bottomLight = new THREE.DirectionalLight(0xffffff, 0.7);
  bottomLight.position.set(0, -10, 0);
  scene.add(bottomLight);

  // Ground & grid
  const gridHelper = new THREE.GridHelper(20, 30, 0x2a2e2b, 0x1e2220);
  scene.add(gridHelper);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x111411, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  return { renderer, scene, camera, keyLight, fillLight, backLight, bottomLight, gridHelper, ground };
}

export function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}
