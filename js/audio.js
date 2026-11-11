((world) => {
  'use strict';

  const { config } = world;

  function createAudio({ state, save }) {
    const song = document.getElementById('song');
    const panel = document.getElementById('audio-panel');
    const panelButton = document.getElementById('audio-panel-button');
    const label = document.getElementById('audio-label');
    const toggle = document.getElementById('music-toggle');
    const volume = document.getElementById('volume');
    const volumeValue = document.getElementById('volume-value');
    const status = document.getElementById('audio-status');
    const gateStatus = document.getElementById('gate-audio-status');
    let error = false;
    let loading = false;
    let tried = false;
    let request = 0;

    function update() {
      const playing = !song.paused && !error && !loading;
      const value = Math.round(state().volume * 100);
      document.body.dataset.playing = String(playing);
      label.textContent = playing ? 'Sound on' : 'Sound off';
      toggle.textContent = playing || loading ? 'Pause our song' : 'Play our song';
      volume.value = value;
      volumeValue.textContent = value + '%';
      status.textContent = error ? 'The song file is unavailable. You can keep exploring quietly.'
        : loading ? 'Loading the song…'
        : playing ? config.musicTitle + ' is playing.' : 'Music starts when you choose to play it.';
      gateStatus.textContent = error ? 'The song is unavailable. You can enter quietly.' : '';
    }
    function applyVolume() {
      song.volume = state().volume;
      update();
    }
    function setPanel(open = panel.hidden) {
      panel.hidden = !open;
      panelButton.setAttribute('aria-expanded', String(open));
    }
    function pause() {
      request++;
      loading = false;
      song.pause();
      update();
    }
    async function play() {
      const current = ++request;
      error = false;
      loading = true;
      if (!config.music || config.music.startsWith('[')) {
        error = true;
        loading = false;
        update();
        return false;
      }
      if (!tried || song.error) {
        song.src = config.music;
        tried = true;
      }
      applyVolume();
      try {
        await song.play();
        if (current !== request) return false;
        loading = false;
        update();
        return true;
      } catch (reason) {
        if (current !== request) return false;
        error = reason.name !== 'AbortError';
        loading = false;
        update();
        return false;
      }
    }
    volume.addEventListener('input', () => {
      state().volume = Number(volume.value) / 100;
      applyVolume();
      save();
    });
    song.addEventListener('play', update);
    song.addEventListener('pause', update);
    song.addEventListener('error', () => {
      if (!tried) return;
      error = true;
      loading = false;
      update();
    });
    applyVolume();

    return {
      panel, setPanel, play, pause, applyVolume,
      toggle:() => song.paused && !loading ? play() : pause()
    };
  }

  world.audio = { createAudio };
})(window.JulieWorld);
