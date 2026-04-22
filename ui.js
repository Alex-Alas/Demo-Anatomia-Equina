import { ANATOMY } from './constants.js';

const panel = document.getElementById('panel');
const panelCat = document.getElementById('panel-cat');
const panelTitle = document.getElementById('panel-title');
const panelBody = document.getElementById('panel-body');
const loadBar = document.getElementById('load-bar');
const loadStatus = document.getElementById('load-status');
const loadingScreen = document.getElementById('loading');
const hotspotsLayer = document.getElementById('hotspots-layer');

export const hotspotEls = {};

export function initUI() {
  document.getElementById('panel-close').addEventListener('click', () => {
    panel.classList.remove('open');
    setTimeout(() => { panel.style.height = ''; }, 400);
  });

  // Fullscreen button
  const fsBtn = document.getElementById('fullscreen-btn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Swipe up/down logic for fluid dragging
  let startY = 0;
  let startHeight = 0;
  const panelHandle = document.getElementById('panel-handle');
  if (panelHandle) {
    panelHandle.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      startHeight = panel.getBoundingClientRect().height;
      panel.style.transition = 'none'; // Disable transition for 1:1 follow
    });
    
    panelHandle.addEventListener('touchmove', e => {
      const y = e.touches[0].clientY;
      const deltaY = startY - y; // Positive if dragging up
      let newHeight = startHeight + deltaY;
      const maxHeight = window.innerHeight * 0.85;
      
      if (newHeight > maxHeight) newHeight = maxHeight;
      panel.style.height = newHeight + 'px';
    }, { passive: true });
    
    panelHandle.addEventListener('touchend', () => {
      panel.style.transition = ''; // Restore CSS transition
      const currentHeight = panel.getBoundingClientRect().height;
      const minHeight = window.innerHeight * 0.35;
      const maxHeight = window.innerHeight * 0.85;
      
      if (currentHeight < minHeight * 0.8) {
        // Dragged down enough to close
        panel.classList.remove('open');
        setTimeout(() => { panel.style.height = ''; }, 400);
      } else if (currentHeight > minHeight * 1.2) {
        // Dragged up enough to expand
        panel.style.height = maxHeight + 'px';
      } else {
        // Snap back to default minimum
        panel.style.height = '';
      }
    });
  }
}

export function openPanel(key) {
  const d = ANATOMY[key];
  panelCat.textContent = d.category;
  panelTitle.textContent = d.label;
  panelBody.innerHTML = `
    <div class="panel-section"><h3>Descripción</h3><p>${d.description}</p></div>
    <div class="panel-section"><h3>Datos Clave</h3>
      <div class="fact-grid">${d.facts.map(f=>`<div class="fact-item"><div class="fact-label">${f.label}</div><div class="fact-value">${f.value}</div></div>`).join('')}</div>
    </div>
    <div class="panel-section"><h3>Sub-estructuras</h3>
      <div class="sub-parts">${d.subparts.map(s=>`<div class="sub-part">${s}</div>`).join('')}</div>
    </div>
    <div class="panel-section"><h3>Relevancia Clínica</h3><p>${d.clinical}</p></div>
  `;
  panel.style.height = ''; // Reset to default 35vh on new open
  panel.classList.add('open');
}

export function setProgress(pct, msg) {
  if (loadBar) loadBar.style.width = pct + '%';
  if (loadStatus) loadStatus.textContent = msg;
}

export function hideLoading() {
  if (loadingScreen) loadingScreen.classList.add('hidden');
}

export function createHotspotDOM(hs) {
  const div = document.createElement('div');
  div.className = 'hotspot';
  div.innerHTML = `<div class="hotspot-inner"></div><div class="hotspot-label">${ANATOMY[hs.key].label}</div>`;
  div.style.pointerEvents = 'all';
  div.addEventListener('click', () => openPanel(hs.key));
  hotspotsLayer.appendChild(div);
  hotspotEls[hs.id] = div;
}

export function updateHotspotsPosition(hotspots, camera) {
  const w = window.innerWidth, h = window.innerHeight;
  hotspots.forEach(hs => {
    const el = hotspotEls[hs.id];
    if (!el) return;
    const v = hs.pos.clone().project(camera);
    el.style.left = ((v.x * 0.5 + 0.5) * w) + 'px';
    el.style.top  = ((v.y * -0.5 + 0.5) * h) + 'px';
    el.style.display = v.z > 1 ? 'none' : 'block';
  });
}
