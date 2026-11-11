((world) => {
  'use strict';

  // Dragging and tapping share the same ordered-puzzle logic. While a pointer is
  // held, sample the actual hit target so implicit touch capture works on mobile.
  function bindTracing(root, {active, step}) {
    let drag = null;
    let lastDragAt = -Infinity;
    root.addEventListener('pointerdown', event => {
      if (event.button !== 0 || !event.isPrimary) return;
      const candidate = event.target.closest('[data-star],[data-ribbon]');
      if (!candidate) return;
      const kind = candidate.hasAttribute('data-star') ? 'star' : 'ribbon';
      if (!active(kind)) return;
      drag = {
        id:event.pointerId, kind, x:event.clientX, y:event.clientY,
        start:Number(candidate.dataset[kind]), previous:null, moved:false
      };
    });
    window.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id || !active(drag.kind)) return;
      if (!drag.moved && Math.hypot(event.clientX-drag.x,event.clientY-drag.y) < 7) return;
      if (!drag.moved) {
        drag.moved = true;
        drag.previous = drag.start;
        step(drag.kind,drag.start);
      }
      const candidate = document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-'+drag.kind+']');
      if (!candidate || !active(drag.kind)) return;
      const index = Number(candidate.dataset[drag.kind]);
      if (index !== drag.previous) {
        drag.previous = index;
        step(drag.kind,index);
      }
    },{passive:true});
    function finish(event) {
      if (!drag || event.pointerId !== drag.id) return;
      if (drag.moved) lastDragAt = performance.now();
      drag = null;
    }
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    root.addEventListener('click', event => {
      if (event.detail && performance.now() - lastDragAt < 300) {
        event.stopPropagation();
        event.preventDefault();
      }
    },true);
  }

  function preparePhoto(config) {
    const image = document.getElementById('personal-photo');
    const status = document.getElementById('photo-status');
    const mat = document.getElementById('photo-mat');
    const full = document.getElementById('full-photo');
    if (!image || !full) return;
    function setStatus(available) {
      mat.setAttribute('aria-busy','false');
      image.hidden = !available;
      status.hidden = available;
      status.textContent = available ? '' : 'This space is waiting for our photograph.';
      full.disabled = !available;
    }
    if (!config.photo || config.photo.startsWith('[')) {
      setStatus(false);
      return;
    }
    mat.setAttribute('aria-busy','true');
    image.addEventListener('load', () => setStatus(true),{once:true});
    image.addEventListener('error', () => setStatus(false),{once:true});
    image.src = config.photo;
  }

  world.interactions = { bindTracing, preparePhoto };
})(window.JulieWorld);
