((world) => {
  'use strict';

  const storageKey = 'james-julie-world-v1';
  const chapters = ['sky','room','photo','future','letter','garden','sunrise'];
  const listFields = ['visited','stars','envelopes','photoNotes','future','hearts','secrets','keys'];

  function initialState() {
    return {
      unlocked:false, chapter:'sky', visited:[], stars:[], envelopes:[],
      photoOpen:false, photoNotes:[], future:[], hearts:[], secrets:[], keys:[],
      letterOpen:false, letterPage:0, letterDone:false, textSize:1,
      finalSeen:false, finalHeart:false, volume:0.5, motion:'system', reflections:{}
    };
  }

  function loadProgress() {
    const initial = initialState();
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || typeof saved !== 'object') return initial;
      for (const [key, fallback] of Object.entries(initial)) {
        const value = saved[key];
        if (listFields.includes(key)) {
          if (Array.isArray(value)) {
            const type = ['visited','secrets','keys'].includes(key) ? 'string' : 'number';
            initial[key] = [...new Set(value.filter(item => typeof item === type))];
          }
        } else if (key === 'reflections') {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            initial.reflections = Object.fromEntries(Object.entries(value).filter(([id, text]) =>
              /^(stars|envelopes|photoNotes|future|garden)\d+$/.test(id) && typeof text === 'string'
            ).map(([id, text]) => [id, text.slice(0,1000)]));
          }
        } else if (typeof value === typeof fallback) {
          initial[key] = value;
        }
      }
      if (!chapters.includes(initial.chapter)) initial.chapter = 'sky';
      initial.volume = Math.min(1, Math.max(0, initial.volume));
      initial.textSize = Math.min(1.45, Math.max(.9, initial.textSize));
      return initial;
    } catch {
      return initial;
    }
  }

  function saveProgress(state) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }
  function resetProgress() {
    const state = initialState();
    saveProgress(state);
    return state;
  }
  function addUnique(list, value) {
    if (list.includes(value)) return false;
    list.push(value);
    return true;
  }

  world.progress = { loadProgress, saveProgress, resetProgress, addUnique };
})(window.JulieWorld);
