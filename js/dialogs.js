((world) => {
  'use strict';

  const { config } = world;
  const { esc } = world.chapters;

  const optionalSecrets = [
    'moon','curtain','under','passage','collection','hiddenHeart','promise','ribbon',
    'diary','mirror','flower','invisible','shooting','bottle','musicBox','butterfly',
    'petal','frame','garden','fountain','gardenHidden','garden0','garden1','garden2'
  ];
  const rooms = ['moon','curtain','under','passage','collection','garden'];
  const byId = id => document.getElementById(id);
  const dialog = byId('story-dialog');
  const content = byId('dialog-content');
  let returnFocus;

  function reflectionNote(id) {
    const [, field, index] = id.match(/^(stars|envelopes|photoNotes|future|garden)(\d+)$/) ?? [];
    return (field === 'garden' ? config.gardenNotes : config[field])?.[Number(index)];
  }
  function reflectionField(id, saved = '') {
    if (!id || !reflectionNote(id)?.reflection) return '';
    return `<details class="reflection-field"${saved ? ' open' : ''}>
      <summary>Keep a thought in this browser</summary>
      <form class="reflection-form" data-reflection="${esc(id)}">
        <label for="reflection-text">A little note to yourself</label>
        <textarea id="reflection-text" maxlength="1000" rows="3">${esc(saved)}</textarea>
        <button class="soft-button" type="submit">Save my thought</button>
        <span id="reflection-status" role="status"></span>
      </form>
    </details>`;
  }

  const button = (label, action, value = '', strong = false) =>
    `<button class="${strong ? 'primary-button' : 'soft-button'}" data-action="${action}" data-value="${esc(value)}">${esc(label)}</button>`;

  function showDialog({title, tag='', text=[], reflection='', token='', footer='', extra='', room='', kind='', object='', origin=document.activeElement}) {
    if (!dialog.open) returnFocus = origin;
    if (room) dialog.dataset.room = room;
    else delete dialog.dataset.room;
    dialog.dataset.kind = kind;
    if (object) dialog.dataset.object = object;
    else delete dialog.dataset.object;
    content.innerHTML = `${tag ? '<p class="dialog-tag">'+esc(tag)+'</p>' : ''}
      <h2 class="dialog-title" id="dialog-title" tabindex="-1">${esc(title)}</h2>
      <div class="dialog-prose">${text.map(line => '<p>'+esc(line)+'</p>').join('')}
      ${reflection ? '<p class="dialog-reflection">'+esc(reflection)+'</p>' : ''}</div>
      ${token ? '<p class="dialog-token">✧ '+esc(token)+'</p>' : ''}${extra}
      ${footer ? '<div class="dialog-buttons">'+footer+'</div>' : ''}`;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    byId('dialog-title').focus({preventScroll:true});
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }
  dialog.addEventListener('close', () => {
    if (document.fullscreenElement && dialog.contains(document.fullscreenElement)) {
      document.exitFullscreen().catch(() => {});
    }
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
    else (byId('chapter-title') || byId('enter-button')).focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });

  function showNote(note, options = {}) {
    showDialog({
      title:note.title, text:note.text, reflection:note.reflection,
      tag:options.tag || 'A note from James',
      extra:reflectionField(options.reflectionId,options.saved),
      footer:button(options.returnLabel || 'Back to the story', options.returnAction || 'close', '', true),
      origin:options.origin
    });
  }
  function showSecret(id, state, options = {}) {
    const item = id === 'finalHeart' ? config.finalHeart : config.secrets[id];
    const gardenNote = /^garden[0-2]$/.test(id) ? config.gardenNotes[Number(id.at(-1))] : null;
    const key = ['moon','curtain'].includes(id) && !state.keys.includes(id);
    const musical = id === 'musicBox';
    const text = id === 'gardenHidden' ? [config.gardenSecret] : gardenNote?.text ?? item.text;
    showDialog({
      title:item.title, text, reflection:gardenNote?.reflection,
      tag:id === 'finalHeart' ? 'A heart for Baby Julie' : rooms.includes(id) ? 'A hidden room' : 'A hidden discovery',
      token:key ? '' : 'Collected · '+item.token,
      room:rooms.includes(id) ? id : '',
      object:['bottle','flower','butterfly','musicBox','petal','mirror','shooting','diary'].includes(id) ? id : '',
      extra:gardenNote ? reflectionField(id,state.reflections[id]) : '',
      kind:id === 'finalHeart' ? 'final' : '',
      footer:(key ? button('Take the '+item.token.toLowerCase(),'take-key',id,true) : '')
        + (musical ? button('Play our song','music-box','',true)+'<span class="music-box-status" id="music-box-status" role="status"></span>' : '')
        + button(options.fromJournal ? 'Back to the journal' : 'Return to the story',options.fromJournal ? 'journal' : 'close','',!key && !musical),
      origin:options.origin
    });
  }
  function showJournal(state, ready, origin) {
    const tokens = state.secrets.map(id => config.secrets[id]).filter(Boolean);
    const count = optionalSecrets.filter(id => state.secrets.includes(id)).length;
    const reflections = Object.keys(state.reflections).map(id => {
      const note = reflectionNote(id);
      return note ? button(note.title,'read-reflection',id) : '';
    }).join('');
    const hearts = config.memories.map((item,i) => {
      const found = state.hearts.includes(i);
      return `<button class="journal-heart${found ? ' found' : ''}" data-action="memory" data-value="${i}" ${found ? '' : 'disabled'}><span aria-hidden="true">${found ? '♥' : '♡'}</span>${found ? esc(item.title) : 'Undiscovered heart'}</button>`;
    }).join('');
    const clues = [
      'The sky keeps a petal, the moon door, and two shapes you can trace.',
      'In the envelope room, open the curtain before trying the diary. The music box and mirror have something to tell you too.',
      'Sweep the glass and look behind the frame in the photograph room.',
      'The glass bottle and the closed flower are waiting in the future scenes.',
      'Try following the ribbon trail. Five hearts show a seam in the wall. Eight hearts open a room from this journal.',
      'Finish the letter and bring the moon key to the garden. Look for three notes, a ripple, a butterfly, and a little light.',
      'There is a shooting star at sunrise. The Final Heart appears once all the discoveries are in your journal.'
    ];
    showDialog({
      title:'Your Memory Journal', tag:'Little things to keep',
      text:[state.hearts.length + ' of 8 hearts collected. ' + count + ' of ' + optionalSecrets.length + ' secrets discovered.'],
      extra:`<div class="journal-grid" aria-label="Memory hearts">${hearts}</div>
        ${tokens.length ? '<p class="dialog-tag">Found along the way</p><ul class="journal-list">'+tokens.map(item=>'<li>✦ '+esc(item.title)+'</li>').join('')+'</ul>' : ''}
        ${reflections ? '<p class="dialog-tag">Your saved thoughts</p><div class="dialog-buttons reflection-links">'+reflections+'</div>' : ''}
        <details class="journal-clues"><summary>Where to look next</summary><ul>${clues.map(clue=>'<li>'+esc(clue)+'</li>').join('')}</ul></details>`,
      footer:(state.hearts.length === 8 ? button('Open the Room of Eight Hearts','secret','collection',true) : '')
        + (ready ? button('Discover the final heart','final-heart','',true) : '') + button('Back to the story','close'),
      origin
    });
  }
  function showSettings(state, origin) {
    showDialog({
      title:'Story settings',tag:'Take it at your pace',
      text:['Your discoveries are saved in this browser. Replay returns to the invitation and keeps your journal. Reset starts a new journal.'],
      footer:button(state.motion === 'off' ? 'Follow device motion setting' : 'Reduce decorative motion','motion')
        + (state.unlocked ? button('Replay from the beginning','replay') : '')
        + (state.unlocked ? button('Reset progress…','reset-confirm') : '')
        + button('Close settings','close'),
      origin
    });
  }
  function confirmReset() {
    showDialog({
      title:'Start again?',tag:'Reset progress',
      text:['This clears the stars, hearts, letters, and saved progress from this browser.'],
      footer:button('Reset progress','reset','',true)+button('Keep my progress','settings')
    });
  }
  function showPhoto(image, origin) {
    showDialog({
      title:'Our photograph',tag:'The Picture I’d Keep',kind:'photo',origin,
      extra:`<img src="${esc(image.getAttribute('src'))}" alt="${esc(image.alt)}">`,
      footer:button('Close photograph','close')
    });
  }

  world.dialogs = { optionalSecrets, reflectionNote, showDialog, closeDialog, showNote, showSecret, showJournal, showSettings, confirmReset, showPhoto };
})(window.JulieWorld);
