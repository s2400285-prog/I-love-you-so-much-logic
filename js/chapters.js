((world) => {
  'use strict';

  const { config } = world;

  const chapters = [
    { id:'sky', title:'A Sky Full of Little Things', rail:'Little Things', time:'8 min', lead:'I put eight little things I love about you in this sky. Pick a light, Baby, and see what I left there.' },
    { id:'room', title:'A Room Full of Reasons', rail:'Four Envelopes', time:'10 min', lead:'I left four envelopes on the table. Open whichever one you feel like reading first.' },
    { id:'photo', title:'The Picture I’d Keep', rail:'Our Picture', time:'12 min', lead:'I made a room for one photograph. When you’re ready, loosen the ribbon and let the light in.' },
    { id:'future', title:'A Little Walk into the Future', rail:'Someday', time:'10 min', lead:'I thought of three places we might find ourselves someday. Come see which one you’d like to visit with me first.' },
    { id:'letter', title:'The Letter I Wrote for You', rail:'My Letter', time:'10 min', lead:'I folded this carefully. It’s yours to read as slowly as you want.' },
    { id:'garden', title:'The World Behind the Letter', rail:'The Garden', time:'5–8 min', lead:'The garden has a little fountain and room for two. I think you’ll like it here.' },
    { id:'sunrise', title:'Stay a Little Longer', rail:'The Sunrise', time:'5 min', lead:'There’s still a little light in the sky, Baby Julie. You can stay here with me as long as you like.' }
  ];

  const heartPoints = [[50,81],[24,61],[13,37],[27,21],[50,34],[73,21],[87,37],[76,61]];
  const scattered = [[50,76],[19,57],[12,32],[26,18],[43,17],[55,34],[72,20],[85,34]];
  const patterns = { hiddenHeart:[0,1,2,3,4,5,6,7], promise:[1,5,7] };
  const ribbonTrail = [0,1,2,3];
  const gardenReady = state => state.letterDone && state.keys.includes('moon');

  function esc(value = '') {
    return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  }

  function signatureMark() {
    return config.signature === 'James'
      ? '<img class="signed-name" src="assets/images/signature.svg" alt="James">'
      : '<span>'+esc(config.signature)+'</span>';
  }

  const button = (label, action, value = '', className = 'soft-button', attributes = '') =>
    `<button class="${className}" data-action="${action}" data-value="${esc(value)}" ${attributes}>${esc(label)}</button>`;
  const noteButton = (label, action, value, seen = false) =>
    `<button class="note-button${seen ? ' seen' : ''}" data-action="${action}" data-value="${esc(value)}"><span aria-hidden="true">${seen ? '✦' : '✧'}</span><span>${esc(label)}</span><span aria-hidden="true">↗</span></button>`;
  const secret = (state, id, label = config.secrets[id].title) =>
    button(`${state.secrets.includes(id) ? '✦' : '✧'} ${label}`,'secret',id,'object-button');
  const stageRibbon = (id = 'stage') => `<svg class="scene-ribbon" aria-hidden="true" viewBox="0 0 600 190" preserveAspectRatio="none">
    <defs><linearGradient id="satin-${id}" x2=".2" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#842f5a"/><stop offset=".34" stop-color="#dc7fa9"/><stop offset=".51" stop-color="#ffc1d1"/><stop offset=".72" stop-color="#a94d78"/><stop offset="1" stop-color="#f4a8c8"/></linearGradient></defs>
    <path d="M-25 138C79 87 133 168 234 108S351 23 410 58s54 87 92 74S565 71 624 49" fill="none" stroke="url(#satin-${id})" stroke-width="15" stroke-linecap="round"/>
    <path d="M-25 134C79 83 133 164 234 104S351 19 410 54s54 87 92 74S565 67 624 45" fill="none" stroke="#fbd0dc" stroke-opacity=".4" stroke-width="1.5"/>
  </svg>`;
  const envelope = (label = '') => `<span class="envelope" aria-hidden="true"><span class="envelope-paper"></span><span class="envelope-flap"></span><span class="envelope-fold"></span><span class="envelope-to">${esc(label)}</span><span class="envelope-band"></span><span class="wax-seal">♡</span></span>`;
  const knot = () => `<span class="knot-shape" aria-hidden="true"><i></i><i></i><b></b></span>`;

  function sky(state, puzzle) {
    const complete = state.stars.length === 8;
    const points = complete ? heartPoints : scattered;
    const lit = puzzle.points;
    const traced = lit.map(index => points[index].join(',')).join(' ');
    const outline = [...points, points[0]].map(point => point.join(',')).join(' ');
    const moon = complete
      ? `<button class="moon-door${state.secrets.includes('moon') ? ' found' : ''}" data-action="secret" data-value="moon" aria-label="Open the Door Behind the Moon"><span>↗</span></button>`
      : '<span class="moon-door" aria-hidden="true"></span>';
    const stars = points.map(([x,y],i) => `<button class="star-point${state.stars.includes(i) || lit.includes(i) ? ' lit' : ''}" style="--x:${x}%;--y:${y}%" data-action="star" data-value="${i}" data-star="${i}" aria-label="Star ${i+1}, ${esc(config.stars[i].title)}${state.stars.includes(i) ? ', discovered' : ''}"><span aria-hidden="true">✦</span><small>${i+1}</small></button>`).join('');
    return `<div class="scene-visual sky-visual${state.secrets.includes('hiddenHeart') ? ' sky-awake' : ''}" aria-label="Eight stars in the pink sky">
      <div class="sky-art"></div>${stageRibbon('sky')}${moon}
      <div class="star-map${puzzle.mode ? ' tracing' : ''}" id="star-map">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline class="constellation-outline${complete ? ' ready' : ''}" points="${outline}"/><polyline id="trace-line" points="${traced}"/></svg>
        ${stars}
      </div>
      <div class="visual-caption"><span aria-hidden="true">✦</span> <span id="sky-count">${state.stars.length} / 8 stars discovered</span></div>
    </div>`;
  }
  function skyControls(state, puzzle) {
    const complete = state.stars.length === 8;
    const mode = puzzle.mode;
    const hint = mode === 'promise' ? 'Follow stars 2 → 6 → 8.' : 'Follow stars 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.';
    return `<div class="chapter-actions">
      <p class="chapter-instruction">${mode ? 'Tap the stars in order or drag across them. ' + hint : 'Choose a star to read its note. All eight lights will show you the way to the moon.'}</p>
      <p class="puzzle-progress" id="puzzle-progress" aria-live="polite" ${mode ? '' : 'hidden'}>${mode ? puzzle.points.length + ' / ' + patterns[mode].length + ' stars connected' : ''}</p>
      <div class="object-row">
        ${complete ? button(state.secrets.includes('hiddenHeart') ? 'Trace the heart again' : 'Trace the heart', 'pattern','hiddenHeart') : ''}
        ${complete ? button('Trace a promise', 'pattern','promise') : ''}
        ${mode ? button('Cancel tracing', 'pattern','') : ''}
        ${secret(state,'petal','Catch a petal')}
        ${complete ? secret(state,'moon','Open the moon door') : ''}
        ${state.secrets.includes('hiddenHeart') ? secret(state,'under','Door under the stars') : ''}
      </div>
    </div>`;
  }

  function room(state) {
    return `<div class="scene-visual room-visual">
      <div class="room-panels"></div>
      <div class="curtain${state.secrets.includes('curtain') ? ' curtain-open' : ''}" aria-hidden="true"></div>
      <button class="curtain-tie" data-curtain data-action="secret" data-value="curtain" aria-label="Open the curtain door">✧</button>
      ${stageRibbon('room')}
      <div class="envelope-table" aria-label="Four envelopes">${config.envelopes.map((item,i) => `<button class="room-envelope${state.envelopes.includes(i) ? ' opened' : ''}" data-action="envelope" data-value="${i}">${envelope(['Admire','Miss','Grateful','Someday'][i])}<span class="envelope-label">${esc(item.title)}</span></button>`).join('')}</div>
      <div class="visual-caption"><span aria-hidden="true">✉</span> ${state.envelopes.length} / 4 envelopes opened</div>
    </div>`;
  }
  function roomControls(state) {
    return `<div class="chapter-actions">
      <div class="object-row">
        ${state.envelopes.length === 4 ? button('Open the secret drawer','drawer') : '<span class="lock-note">The drawer opens after all four envelopes.</span>'}
        ${secret(state,'curtain','Draw the curtain')}
        ${secret(state,'diary','Try the locked diary')}
        ${secret(state,'musicBox','Open the music box')}
        ${secret(state,'mirror','Look in the mirror')}
      </div>
    </div>`;
  }

  function photo(state) {
    return `<div class="scene-visual photo-visual${state.photoOpen ? ' photo-unwrapped' : ''}" id="photo-visual">
      <div class="photo-light"></div>
      <figure class="photo-frame">
        <div class="photo-mat" id="photo-mat" aria-busy="false">
          <div class="photo-message" id="photo-status" role="status">${state.photoOpen ? 'Loading our photograph…' : 'For Baby Julie'}</div>
          <img id="personal-photo" alt="${esc(config.photoAlt)}" hidden>
        </div>
        ${state.photoOpen ? `<figcaption>${esc(config.photoMemory)}</figcaption>` : ''}
      </figure>
      ${state.photoOpen ? `<button class="frame-secret" data-action="secret" data-value="frame" aria-label="Find the tiny envelope behind the frame">✧</button>` : `<div class="photo-wrap">${stageRibbon('photo')}<button class="knot-button" data-action="untie-photo">${knot()}<span>Untie the ribbon</span></button></div>`}
    </div>`;
  }
  function photoControls(state) {
    return `<div class="chapter-actions">
      ${state.photoOpen ? `<div class="note-list">${config.photoNotes.map((item,i) => noteButton(item.title,'photo-note',i,state.photoNotes.includes(i))).join('')}</div>
      <div class="object-row">${button('View photograph full screen','fullscreen','','soft-button','id="full-photo" disabled')}${secret(state,'frame','Look behind the frame')}</div>` : button('Untie the ribbon','untie-photo','','primary-button')}
      <div class="object-row">${secret(state,'invisible','Sweep the glass')}</div>
    </div>`;
  }

  const futureArt = {
    cafe:'<div class="rain-window"><div class="rain"></div></div><div class="cafe-table"></div><div class="lamp"><i></i></div><div class="coffee"><i></i><b></b><b></b><b></b></div>',
    sunset:'<div class="future-land"></div><span class="future-stars">✦　·　✧　　　·</span>',
    evening:'<div class="evening-view"><i></i><b></b><b></b><b></b><b></b></div><div class="evening-sill"></div>'
  };
  function future(state, selection) {
    const selected = config.future[selection];
    const seen = state.future.includes(selection);
    return `<div class="scene-visual future-visual future-${selected.id}${seen ? ' environment-awake' : ''}">
      <div class="environment" aria-hidden="true">${futureArt[selected.id]}${stageRibbon('future')}</div>
      <div class="environment-overlay">
        <span class="environment-name">${esc(selected.title)}</span>
        ${button(seen ? selected.after : selected.label,'future-read',selection,'primary-button')}
      </div>
    </div>`;
  }
  function futureControls(state, selection) {
    return `<div class="chapter-actions"><div class="note-list" aria-label="Future scenes">${config.future.map((item,i) =>
      `<button class="note-button${state.future.includes(i) ? ' seen' : ''}" data-action="future-select" data-value="${i}" aria-pressed="${selection === i}"><span aria-hidden="true">${state.future.includes(i) ? '✦' : '✧'}</span><span>${esc(item.title)}</span><span aria-hidden="true">↗</span></button>`
    ).join('')}</div>
    <div class="object-row">
      ${state.future.length === config.future.length ? button('Take the secret staircase','staircase') : ''}
      ${secret(state,'bottle','Pick up the glass bottle')}
      ${secret(state,'flower','Touch the closed flower')}
    </div></div>`;
  }

  function letter(state) {
    if (!state.letterOpen) {
      return `<div class="scene-visual letter-visual sealed-letter"><div class="paper-window"></div>${stageRibbon('letter')}
        <button class="letter-envelope" data-action="open-letter">${envelope('For Baby Julie')}<span>Untie my letter</span></button>
      </div>`;
    }
    const count = Math.min(state.letterPage,config.letter.length);
    const sections = config.letter.slice(0,count).map((part,i) =>
      `<section class="letter-section" id="letter-part-${i+1}" tabindex="-1"><h3>${esc(part.title)}</h3>${part.text.map(line => `<p>${esc(line)}</p>`).join('')}</section>`
    ).join('');
    return `<article class="letter-paper" id="letter-paper" style="--letter-size:${state.textSize}rem" aria-label="James’s letter">
      <p class="paper-address">For ${esc(config.recipient)}</p>
      ${count > 1 ? '<nav class="letter-index" aria-label="Revealed letter sections">'+config.letter.slice(0,count).map((part,i) =>
        button(String(i+1),'letter-jump',i+1,'soft-button','aria-label="'+esc(part.title)+'"')).join('')+'</nav>' : ''}
      ${sections}
      ${state.letterDone ? `<p class="signature letter-signature">With all my love,<br>${signatureMark()}</p>` : ''}
      <div class="paper-controls">
        ${count < config.letter.length ? button('Reveal the next section','letter-next','','primary-button') : ''}
        ${count > 1 ? button('Previous section','letter-previous') : ''}
      </div>
    </article>`;
  }
  function letterControls(state) {
    return `<div class="chapter-actions"><div class="object-row">
      ${state.letterOpen ? '' : button('Untie my letter','open-letter','','primary-button')}
      ${!state.letterDone ? button('Read the whole letter','letter-all') : ''}
      ${state.letterOpen ? button('Smaller text','letter-size',-1,'soft-button','aria-label="Make letter text smaller"') : ''}
      ${state.letterOpen ? button('Larger text','letter-size',1,'soft-button','aria-label="Make letter text larger"') : ''}
      ${button('Sound settings','audio-panel')}
      ${state.letterDone && gardenReady(state) ? button('Open the glass garden door','navigate','garden') : ''}
    </div>
    ${state.letterDone && !gardenReady(state) ? '<p class="lock-note">The optional garden opens with the glass key from the moon door.</p>' : ''}
    </div>`;
  }

  function garden(state) {
    const open = state.secrets.includes('garden');
    return `<div class="scene-visual garden-visual${open ? ' garden-open' : ''}">
      <div class="garden-sky" aria-hidden="true"><span>♡　·　♡　　✧　　♡</span><span>·　♡　　♡　·　♡</span><span>♡　　✧　　　♡　·</span></div>
      ${stageRibbon('garden')}
      ${open ? `<div class="floating-island"></div><button class="fountain" data-action="secret" data-value="fountain"><span class="water-ripple" aria-hidden="true"></span><span class="water-ripple" aria-hidden="true"></span><span class="water-ripple" aria-hidden="true"></span><span>Touch the wishing water</span></button>
      <button class="garden-light" data-action="secret" data-value="gardenHidden" aria-label="Discover the smallest light">✧</button>` : `<button class="glass-door" data-action="secret" data-value="garden"><span aria-hidden="true">♥</span><span>Turn the glass key</span></button>`}
    </div>`;
  }
  function gardenControls(state) {
    return `<div class="chapter-actions">
      ${state.secrets.includes('garden') ? `<div class="note-list">${config.gardenNotes.map((item,i) => noteButton(item.title,'garden-note',i,state.secrets.includes('garden'+i))).join('')}</div>
      <div class="object-row">${secret(state,'butterfly','Follow the glasswing butterfly')}${secret(state,'gardenHidden','Look for the smallest light')}</div>` : button('Turn the glass key','secret','garden','primary-button')}
    </div>`;
  }

  function sunrise(state) {
    return `<div class="scene-visual sunrise-visual${state.finalSeen ? ' sunrise-awake' : ''}">
      <div class="sunrise-land"></div><div class="sunrise-dawn"></div>${stageRibbon('sunrise')}
      <button class="final-star" data-action="final-star"><span aria-hidden="true">✦</span><span>One last light</span></button>
      <button class="shooting-star" data-action="secret" data-value="shooting" aria-label="Catch the shooting star" ${state.secrets.includes('shooting') ? '' : 'hidden'}>✦</button>
      <div class="visual-caption">${state.finalSeen ? 'The world stays open for you.' : 'Stay as long as you like.'}</div>
    </div>`;
  }
  function sunriseControls(state, ready) {
    return `<div class="chapter-actions"><div class="object-row">
      ${button('Listen to our song again','music-finale')}
      ${button('Visit our photograph again','navigate','photo')}
      ${button('Discover the final message','final-star','','primary-button')}
      ${secret(state,'shooting','Catch a shooting star')}
      ${ready ? button('Discover the final heart','final-heart') : ''}
    </div></div>`;
  }

  function ribbonPuzzle(state, puzzle) {
    if (!puzzle.ribbon) return '';
    return `<div class="ribbon-puzzle" id="ribbon-puzzle">
      <p>Follow the satin in order. Tap each knot or drag across the trail.</p>
      <div class="ribbon-track">${stageRibbon('trail')}${ribbonTrail.map((_,i) => `<button class="ribbon-stop" data-ribbon="${i}" data-action="ribbon-point" data-value="${i}" aria-label="Ribbon knot ${i+1}">${i+1}</button>`).join('')}</div>
      <p id="ribbon-progress" aria-live="polite">${puzzle.ribbonPoints.length} / 4 knots touched</p>
    </div>`;
  }
  function renderChapter(state, puzzle, finalReady) {
    const index = chapters.findIndex(item => item.id === state.chapter);
    const current = chapters[index];
    const selection = puzzle.futureSelection;
    const views = {
      sky: [sky, skyControls],
      room: [room, roomControls],
      photo: [photo, photoControls],
      future: [future, futureControls],
      letter: [letter, letterControls],
      garden: [garden, gardenControls],
      sunrise: [sunrise, sunriseControls]
    };
    const [view, controls] = views[current.id];
    const arg = current.id === 'future' ? selection : current.id === 'sunrise' ? finalReady : puzzle;
    const title = current.title.split(' ');
    const emphasis = title.splice(Math.max(1, title.length - 2)).join(' ');
    const route = chapters.filter(item => item.id !== 'garden' || gardenReady(state));
    const routeIndex = route.findIndex(item => item.id === current.id);
    const previous = route[routeIndex-1];
    const next = route[routeIndex+1];
    const ribbonHere = ['sky','room','photo','future','letter'].includes(current.id);
    return `<section class="chapter chapter-${current.id}" aria-labelledby="chapter-title">
      <div class="chapter-grid">
        <div class="chapter-copy">
          <p class="eyebrow"><span></span> Chapter ${String(index+1).padStart(2,'0')} / 07 · ${esc(current.time)}</p>
          <h1 id="chapter-title" tabindex="-1">${esc(title.join(' '))} <em>${esc(emphasis)}</em></h1>
          <p class="chapter-lead">${esc(current.lead)}</p>
          ${controls(state,arg)}
        </div>
        ${view(state,arg)}
      </div>
      ${ribbonHere ? `<div class="ribbon-guide" data-reveal><button class="text-button" data-action="ribbon-note"><span aria-hidden="true">〰</span> Touch the satin ribbon</button>
        ${button(state.secrets.includes('ribbon') ? 'Trace the ribbon again' : 'Follow the ribbon trail','ribbon-toggle','','text-button','aria-expanded="'+puzzle.ribbon+'"')}
        ${ribbonPuzzle(state,puzzle)}
      </div>` : ''}
      <div class="chapter-navigation" data-reveal>
        ${previous ? button('← ' + previous.rail,'navigate',previous.id,'text-button') : button('← Invitation','home','','text-button')}
        ${state.hearts.length >= 5 ? secret(state,'passage','A seam in the wall') : ''}
        ${next ? button(next.rail+' →','navigate',next.id,'text-button') : button('Back to the stars ↗','navigate','sky','text-button')}
      </div>
    </section>`;
  }

  world.chapters = { chapters, patterns, ribbonTrail, gardenReady, esc, signatureMark, renderChapter };
})(window.JulieWorld);
