((world) => {
  'use strict';

  const { config } = world;
  const { addUnique, loadProgress, resetProgress, saveProgress } = world.progress;
  const { chapters, esc, gardenReady, patterns, renderChapter, ribbonTrail, signatureMark } = world.chapters;
  const { createAudio } = world.audio;
  const { bindTracing, preparePhoto } = world.interactions;
  const { clearSceneMotion, enterScene, flyHeart, openInvitation, reduced, setupMotion } = world.motion;
  const { closeDialog, confirmReset, optionalSecrets, reflectionNote, showDialog, showJournal, showNote, showPhoto, showSecret, showSettings } = world.dialogs;

  const byId = id => document.getElementById(id);
  const ui = {
    invitation:byId('invitation'), gate:byId('gate'), story:byId('story'),
    chapter:byId('chapter'), rail:byId('chapter-rail'), form:byId('password-form'),
    password:byId('password'), soundChoice:byId('sound-choice'), dialog:byId('story-dialog')
  };
  const newPuzzle = () => ({mode:'', points:[], futureSelection:0, ribbon:false, ribbonPoints:[]});
  let state = loadProgress();
  let puzzle = newPuzzle();
  let storageAvailable = true;
  let passwordAccepted = false;
  let lastView = 'intro';
  let transition = false;
  let invisibleSweep = null;
  let toastTimeout;

  const motion = setupMotion();
  const audio = createAudio({state:() => state, save});
  const chapterIds = chapters.map(item => item.id);
  const finalReady = () => optionalSecrets.every(id => state.secrets.includes(id));
  const label = (name, action, value = '', strong = false) =>
    `<button class="${strong ? 'primary-button' : 'soft-button'}" data-action="${action}" data-value="${esc(value)}">${esc(name)}</button>`;

  function announce(message) {
    const node = byId('announcement');
    node.textContent = '';
    requestAnimationFrame(() => { node.textContent = message; });
  }
  function notify(message) {
    const toast = byId('toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {toast.hidden = true;},4800);
    announce(message);
  }
  function save() {
    const available = saveProgress(state);
    if (storageAvailable && !available) announce('This browser could not save the story. You can keep exploring in this tab.');
    storageAvailable = available;
  }
  function applyMotion() {
    document.body.classList.toggle('motion-off',state.motion === 'off');
    if (reduced()) clearSceneMotion();
    motion.refresh();
  }
  function updateHeader() {
    document.querySelectorAll('[data-story]').forEach(node => {node.hidden = lastView !== 'story';});
    byId('resume-button').hidden = !state.unlocked;
    byId('journal-count').textContent = state.hearts.length + '/8';
    const footer = byId('footer-note');
    footer.textContent = lastView === 'story' ? 'Your story saves as you go.' : 'Take your time. This world is yours.';
    if (lastView === 'story' && !storageAvailable) footer.textContent = 'Progress is available in this tab.';
  }
  function setView(view, focus) {
    lastView = view;
    ui.invitation.hidden = view !== 'intro';
    ui.gate.hidden = view !== 'gate';
    ui.story.hidden = view !== 'story';
    document.body.dataset.scene = view === 'story' ? state.chapter : view;
    audio.setPanel(false);
    updateHeader();
    if (focus) {
      window.scrollTo(0,0);
      focus.focus({preventScroll:true});
    }
  }
  function home() {
    closeDialog();
    clearSceneMotion();
    setView('intro',byId('enter-button'));
  }
  async function invite() {
    if (transition) return;
    transition = true;
    byId('enter-button').disabled = true;
    await openInvitation(ui.invitation);
    transition = false;
    byId('enter-button').disabled = false;
    if (lastView !== 'intro') return;
    passwordAccepted = false;
    ui.password.value = '';
    ui.form.hidden = false;
    ui.soundChoice.hidden = true;
    ui.gate.classList.remove('gate-unlocked');
    byId('password-status').textContent = '';
    setView('gate',byId('gate-title'));
    enterScene(ui.gate,false);
  }
  function renderRail() {
    ui.rail.innerHTML = chapters.map((chapter,i) => {
      const open = chapter.id !== 'garden' || gardenReady(state);
      const current = chapter.id === state.chapter;
      const visited = state.visited.includes(chapter.id);
      return `<button class="rail-button" data-action="navigate" data-value="${chapter.id}"${current ? ' aria-current="step"' : ''}${open ? '' : ' aria-disabled="true"'} aria-label="Chapter ${i+1}, ${esc(chapter.title)}${open ? visited ? ', visited' : '' : ', optional and locked'}">
        <span aria-hidden="true">${String(i+1).padStart(2,'0')}${visited ? ' ✦' : open ? '' : ' · LOCKED'}</span>${esc(chapter.rail)}
      </button>`;
    }).join('');
  }
  function matchingButton(origin) {
    if (!origin?.dataset.action) return byId('chapter-title');
    const replacement = [...ui.chapter.querySelectorAll('[data-action]')].find(node => {
      return node.dataset.action === origin.dataset.action && node.dataset.value === origin.dataset.value && !node.disabled;
    });
    return replacement || byId('chapter-title');
  }
  function render(origin, animate = false) {
    clearSceneMotion();
    ui.chapter.innerHTML = renderChapter(state,puzzle,finalReady());
    renderRail();
    updateHeader();
    if (state.chapter === 'photo' && state.photoOpen) preparePhoto(config);
    if (animate) enterScene(ui.chapter);
    const focus = origin && !origin.isConnected ? matchingButton(origin) : origin;
    if (focus && !ui.dialog.open) focus.focus({preventScroll:true});
    return focus;
  }
  function navigate(id, origin) {
    if (!state.unlocked || !chapterIds.includes(id)) return;
    if (id === 'garden' && !gardenReady(state)) {
      showNote({title:'The glass garden door',text:['Finish the main letter and take the glass key from the room behind the moon. You can visit the sunrise whenever you like.']},{origin,tag:'An optional room'});
      return;
    }
    closeDialog();
    puzzle = newPuzzle();
    invisibleSweep = null;
    state.chapter = id;
    addUnique(state.visited,id);
    save();
    setView('story');
    render(null,true);
    window.scrollTo(0,0);
    byId('chapter-title').focus({preventScroll:true});
  }
  function start(withMusic) {
    if (!passwordAccepted || lastView !== 'gate') return;
    passwordAccepted = false;
    if (withMusic) {
      audio.play().then(played => {
        if (!played) notify('The song file is unavailable. You can keep exploring quietly.');
      });
    } else {
      audio.pause();
    }
    state.unlocked = true;
    motion.burst();
    navigate('sky');
  }
  function replay() {
    audio.pause();
    state.chapter = 'sky';
    save();
    home();
  }
  function reset() {
    audio.pause();
    state = resetProgress();
    puzzle = newPuzzle();
    applyMotion();
    audio.applyVolume();
    home();
    announce('Story progress reset.');
  }
  function collect(index, origin) {
    if (!addUnique(state.hearts,index)) return;
    flyHeart(origin);
    announce('Memory heart collected. ' + state.hearts.length + ' of 8.');
  }
  function chapterNote(field, notes, index, origin) {
    if (!notes[index]) return;
    const reflectionId = field+index;
    const show = origin => showNote(notes[index],{origin,reflectionId,saved:state.reflections[reflectionId]});
    const fresh = addUnique(state[field],index);
    if (fresh) {
      const count = state[field].length;
      if (field === 'stars' && count === 4) collect(0,origin);
      if (field === 'stars' && count === 8) collect(1,origin);
      if (field === 'envelopes' && count === 2) collect(2,origin);
      if (field === 'envelopes' && count === 4) collect(3,origin);
      if (field === 'photoNotes' && count === 3) collect(5,origin);
      if (field === 'future' && count === config.future.length) collect(6,origin);
      save();
      origin = render(origin);
      if (field === 'future' && !reduced()) {
        const art = ui.chapter.querySelector('.future-visual');
        art.classList.add('environment-igniting');
        setTimeout(() => {
          if (art.isConnected && !ui.dialog.open) show(origin);
        },520);
        return;
      }
    }
    show(origin);
  }
  function untiePhoto(origin) {
    if (state.photoOpen) return;
    state.photoOpen = true;
    collect(4,origin);
    save();
    render(origin);
    byId('photo-visual').classList.add('unfolding');
  }
  function revealLetter(mode, origin) {
    const opening = !state.letterOpen;
    state.letterOpen = true;
    state.letterPage = mode === 'all' ? config.letter.length
      : Math.min(Math.max(1,state.letterPage+1),config.letter.length);
    if (state.letterPage >= config.letter.length) {
      state.letterDone = true;
      collect(7,origin);
    }
    save();
    render(origin);
    if (opening) byId('letter-paper').classList.add('unfolding');
    focusLetterSection(mode === 'all' ? 1 : state.letterPage);
  }
  function focusLetterSection(number) {
    const section = byId('letter-part-'+number);
    if (!section) return;
    section.focus({preventScroll:true});
    section.scrollIntoView({behavior:reduced() ? 'instant' : 'smooth',block:'nearest'});
  }
  function secretAllowed(id) {
    if (id === 'moon') return state.stars.length === 8;
    if (id === 'under') return state.secrets.includes('hiddenHeart');
    if (id === 'passage') return state.hearts.length >= 5;
    if (id === 'collection') return state.hearts.length === 8;
    if (id === 'diary') return state.keys.includes('curtain');
    if (id === 'frame') return state.photoOpen;
    if (id === 'garden') return gardenReady(state);
    if (['garden0','garden1','garden2','fountain','butterfly','gardenHidden'].includes(id)) return state.secrets.includes('garden');
    return true;
  }
  const lockClues = {
    moon:'The moon door will open when all eight stars have been discovered.',
    under:'Trace the heart to find the door under the stars.',
    diary:'The diary has a small lock. Look behind the pink curtain for the key.',
    garden:'Finish the letter and bring the glass key from the moon door.'
  };
  function discover(id, origin) {
    if (!optionalSecrets.includes(id)) return;
    const fromJournal = ui.dialog.open && Boolean(ui.dialog.querySelector('.journal-grid'));
    if (!secretAllowed(id)) {
      showNote({title:config.secrets[id].title,text:[lockClues[id] || 'There are still a few things to find before this opens.']},{origin,tag:'A little clue'});
      return;
    }
    if (addUnique(state.secrets,id)) {
      save();
      origin = render(origin);
    }
    if (id === 'fountain') {
      const fountain = ui.chapter.querySelector('.fountain');
      fountain?.classList.remove('rippling');
      requestAnimationFrame(() => fountain?.classList.add('rippling'));
      if (!reduced() && !ui.dialog.open) {
        setTimeout(() => { if (fountain?.isConnected && !ui.dialog.open) showSecret(id,state,{origin,fromJournal}); },450);
        return;
      }
    }
    showSecret(id,state,{origin,fromJournal});
  }
  function takeKey(id) {
    if (!['moon','curtain'].includes(id) || !state.secrets.includes(id)) return;
    addUnique(state.keys,id);
    save();
    render();
    showSecret(id,state);
    announce(config.secrets[id].token + ' collected.');
  }
  function progressPuzzle(kind,index) {
    const star = kind === 'star';
    const mode = puzzle.mode;
    const path = star ? patterns[mode] : ribbonTrail;
    if (!path) return;
    const points = star ? puzzle.points : puzzle.ribbonPoints;
    if (points.at(-1) === index) return;
    const expected = path[points.length];
    if (index === expected) points.push(index);
    else points.splice(0,points.length,...(index === path[0] ? [index] : []));
    const buttons = ui.chapter.querySelectorAll('[data-'+kind+']');
    buttons.forEach(node => node.classList.toggle('connected',points.includes(Number(node.dataset[kind]))));
    const count = byId(star ? 'puzzle-progress' : 'ribbon-progress');
    count.textContent = index !== expected && !points.length
      ? 'Start again at ' + (star ? 'star ' : 'knot ') + (path[0]+1) + '.'
      : points.length + ' / ' + path.length + (star ? ' stars connected' : ' knots touched');
    if (star) {
      const line = points.map(i => {
        const node = ui.chapter.querySelector('[data-star="'+i+'"]');
        return parseFloat(node.style.getPropertyValue('--x')) + ',' + parseFloat(node.style.getPropertyValue('--y'));
      });
      byId('trace-line').setAttribute('points',line.join(' '));
    }
    if (points.length === path.length) {
      const focus = document.activeElement;
      if (star) {
        puzzle.mode = '';
        puzzle.points = [];
      } else {
        puzzle.ribbon = false;
        puzzle.ribbonPoints = [];
      }
      if (state.secrets.includes(star ? mode : 'ribbon')) render(focus);
      discover(star ? mode : 'ribbon',focus);
    }
  }
  function finalStar(origin) {
    if (!state.finalSeen) {
      state.finalSeen = true;
      save();
      // Keep the night image in the DOM so dawn can fade into it.
      ui.chapter.querySelector('.sunrise-visual').classList.add('sunrise-awake');
      ui.chapter.querySelector('.sunrise-visual .visual-caption').textContent = 'The world stays open for you.';
    }
    showDialog({title:'Stay a little longer',tag:'One last light',text:[config.closing],kind:'final',
      footer:label('Stay in the sunrise','close','',true),origin});
  }
  function finalHeart(origin) {
    if (!finalReady()) return;
    state.finalHeart = true;
    save();
    showSecret('finalHeart',state,{origin,fromJournal:ui.dialog.open});
  }

  const actions = {
    enter:invite,
    resume:() => navigate(state.chapter === 'garden' && !gardenReady(state) ? 'letter' : state.chapter),
    home,
    'start-music':() => start(true),
    'start-quiet':() => start(false),
    navigate:(value,origin) => navigate(value,origin),
    'audio-panel':(_,origin) => {
      const open = audio.panel.hidden;
      audio.setPanel(open);
      if (open) {
        if (ui.dialog.open) closeDialog();
        requestAnimationFrame(() => byId('music-toggle').focus());
      } else if (audio.panel.contains(origin)) byId('audio-panel-button').focus();
    },
    music:() => audio.toggle(),
    'music-finale':async () => {
      if (!await audio.play()) {
        audio.setPanel(true);
        byId('music-toggle').focus();
      }
    },
    'music-box':async () => {
      const played = await audio.play();
      const status = byId('music-box-status');
      if (status) status.textContent = played ? 'Our song is playing.' : 'The song is unavailable. The note is here to keep.';
    },
    close:closeDialog,
    journal:(_,origin) => showJournal(state,finalReady(),origin),
    settings:(_,origin) => showSettings(state,origin),
    motion:() => {
      state.motion = state.motion === 'off' ? 'system' : 'off';
      applyMotion();
      save();
      showSettings(state);
    },
    replay,
    'reset-confirm':confirmReset,
    reset,
    star:(value,origin) => puzzle.mode ? progressPuzzle('star',Number(value)) : chapterNote('stars',config.stars,Number(value),origin),
    envelope:(value,origin) => chapterNote('envelopes',config.envelopes,Number(value),origin),
    drawer:(_,origin) => {
      if (state.envelopes.length === 4) showNote({title:'In the secret drawer',text:[config.drawer]},{origin});
    },
    pattern:(value,origin) => {
      puzzle.mode = value;
      puzzle.points = [];
      render(origin);
      if (value) byId('star-map').querySelector('[data-star="'+patterns[value][0]+'"]').focus();
    },
    'ribbon-note':(_,origin) => showNote({title:'A little thread of pink',text:[
      'I left a ribbon running through the rooms so there would always be a little something familiar when you opened another door. I like the thought of you picking it up again anywhere you want.',
      config.secretMessage
    ]},{origin}),
    'ribbon-toggle':(_,origin) => {
      puzzle.ribbon = !puzzle.ribbon;
      puzzle.ribbonPoints = [];
      render(origin);
      if (puzzle.ribbon) ui.chapter.querySelector('[data-ribbon="0"]').focus();
    },
    'ribbon-point':value => progressPuzzle('ribbon',Number(value)),
    secret:discover,
    'take-key':takeKey,
    'untie-photo':(_,origin) => untiePhoto(origin),
    'photo-note':(value,origin) => chapterNote('photoNotes',config.photoNotes,Number(value),origin),
    fullscreen:(_,origin) => {
      const image = byId('personal-photo');
      if (image && !image.hidden) showPhoto(image,origin);
    },
    'future-select':(value,origin) => {
      puzzle.futureSelection = Number(value);
      render(origin);
    },
    'future-read':(value,origin) => chapterNote('future',config.future,Number(value),origin),
    staircase:(_,origin) => {
      if (state.future.length < config.future.length) return;
      showDialog({title:'The staircase in the light',tag:'A little farther',
        text:['At the top, there is a letter I have been wanting to give you. Come upstairs whenever you feel ready.'],
        footer:label('Follow the stairs to my letter','navigate','letter',true),origin});
    },
    'open-letter':(_,origin) => revealLetter('next',origin),
    'letter-next':(_,origin) => revealLetter('next',origin),
    'letter-all':(_,origin) => revealLetter('all',origin),
    'letter-jump':value => focusLetterSection(Number(value)),
    'letter-previous':() => {
      const sections = [...document.querySelectorAll('.letter-section')];
      const nearest = sections.findLastIndex(section => section.getBoundingClientRect().top < innerHeight*.52);
      const active = document.activeElement?.id.match(/^letter-part-(\d+)$/);
      focusLetterSection(Math.max(1,active ? Number(active[1])-1 : nearest));
    },
    'letter-size':(value,origin) => {
      state.textSize = Math.min(1.45,Math.max(.9,Number((state.textSize + Number(value)*.1).toFixed(2))));
      byId('letter-paper')?.style.setProperty('--letter-size',state.textSize+'rem');
      save();
      announce('Letter text size ' + Math.round(state.textSize*100) + ' percent.');
      origin.focus({preventScroll:true});
    },
    'garden-note':(value,origin) => discover('garden'+value,origin),
    memory:(value,origin) => {
      const index = Number(value);
      if (!state.hearts.includes(index)) return;
      const note = config.memories[index];
      showNote({title:note.title,text:[note.text]},{tag:'A memory heart',origin,returnAction:'journal',returnLabel:'Back to the journal'});
    },
    'read-reflection':value => {
      const note = reflectionNote(value);
      if (note && state.reflections[value]) showNote(note,{
        reflectionId:value,saved:state.reflections[value],tag:'Your saved thought',
        returnAction:'journal',returnLabel:'Back to the journal'
      });
    },
    'final-star':(_,origin) => finalStar(origin),
    'final-heart':(_,origin) => finalHeart(origin)
  };

  ui.form.addEventListener('submit', event => {
    event.preventDefault();
    if (ui.password.value !== config.password) {
      byId('password-status').textContent = config.wrongPassword;
      ui.password.setAttribute('aria-invalid','true');
      ui.password.focus();
      ui.password.select();
      return;
    }
    passwordAccepted = true;
    ui.password.removeAttribute('aria-invalid');
    ui.password.value = '';
    byId('password-status').textContent = '';
    ui.form.hidden = true;
    ui.soundChoice.hidden = false;
    ui.gate.classList.add('gate-unlocked');
    motion.burst();
    ui.gate.querySelector('[data-action="start-music"]').focus();
    enterScene(ui.soundChoice,false);
  });
  ui.dialog.addEventListener('submit',event => {
    const form = event.target.closest('[data-reflection]');
    if (!form) return;
    event.preventDefault();
    const id = form.dataset.reflection;
    if (!reflectionNote(id)) return;
    const thought = form.querySelector('textarea').value.trim().slice(0,1000);
    if (thought) state.reflections[id] = thought;
    else delete state.reflections[id];
    save();
    byId('reflection-status').textContent = !storageAvailable ? 'Kept for this tab.' :
      thought ? 'Saved in this browser.' : 'Thought removed.';
  });
  ui.password.addEventListener('input', () => {
    ui.password.removeAttribute('aria-invalid');
    byId('password-status').textContent = '';
  });
  byId('home-link').addEventListener('click', event => {event.preventDefault(); home();});
  document.addEventListener('click',event => {
    const origin = event.target.closest('[data-action]');
    if (!origin || origin.disabled) return;
    actions[origin.dataset.action]?.(origin.dataset.value || '',origin);
  });
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape' && !audio.panel.hidden && !ui.dialog.open) {
      audio.setPanel(false);
      byId('audio-panel-button').focus();
    }
  });
  ui.chapter.addEventListener('pointermove',event => {
    if (state.chapter !== 'photo' || state.secrets.includes('invisible') || ui.dialog.open) return;
    if (!event.target.closest('.photo-mat')) { invisibleSweep = null; return; }
    if (!invisibleSweep) invisibleSweep = {x:event.clientX,y:event.clientY};
    else if (Math.hypot(event.clientX-invisibleSweep.x,event.clientY-invisibleSweep.y) > 84) {
      discover('invisible',ui.chapter.querySelector('[data-value="invisible"]'));
    }
  });
  window.addEventListener('scroll',() => {
    if (lastView !== 'story' || state.chapter !== 'sunrise' || window.scrollY < 30) return;
    const shootingStar = ui.chapter.querySelector('.shooting-star[hidden]');
    if (!shootingStar) return;
    shootingStar.hidden = false;
    shootingStar.classList.add('star-arrival');
  },{passive:true});
  let curtainSwipe = null;
  ui.chapter.addEventListener('pointerdown',event => {
    const target = event.target.closest('[data-curtain]');
    if (target) curtainSwipe = {target,id:event.pointerId,x:event.clientX};
  });
  window.addEventListener('pointerup',event => {
    if (curtainSwipe?.id !== event.pointerId) return;
    const {target,x} = curtainSwipe;
    curtainSwipe = null;
    if (target.isConnected && Math.abs(event.clientX-x)>40) discover('curtain',target);
  });
  window.addEventListener('pointercancel',() => { curtainSwipe = null; });
  bindTracing(ui.chapter,{
    active:kind => kind === 'star' ? Boolean(puzzle.mode) : puzzle.ribbon,
    step:progressPuzzle
  });

  byId('intro-greeting').textContent = 'Hi, '+config.recipient+'.';
  byId('intro-description').textContent = config.intro;
  byId('intro-signature').innerHTML = signatureMark();
  byId('password-hint').textContent = config.passwordHint;
  byId('footer-context').innerHTML = '<span class="footer-dot"></span> A little universe by '+esc(config.creator);
  document.querySelector('.hero-envelope .envelope-to').textContent = 'For '+config.recipient;
  applyMotion();
  updateHeader();
})(window.JulieWorld);
