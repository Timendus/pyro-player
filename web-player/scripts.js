window.addEventListener('load', function() {
  const playButton  = document.querySelector('button.play');
  const srtButton   = document.querySelector('#subtitles');
  const mediaButton = document.querySelector('#media');

  const player           = new Player(playButton);
  const watcher          = new PlayerWatcher(player);
  const firingInstructor = new FiringInstructor();

  mediaButton.addEventListener('change', (e) => {
    new InMemoryFile({
      file: e.target.files[0],
      type: 'media'
    })
    .then((file) => {
      player.loadFile(file.contents);
      updateButtonStates();
    });
  });

  srtButton.addEventListener('change', (e) => {
    new InMemoryFile({
      file: e.target.files[0],
      type: 'subtitles'
    })
    .then((file) => {
      if ( (wrong = firingInstructor.invalidCommands(file.contents)).length == 0 ) {
        watcher.setCallbackMoments(file.contents, (m) => { console.log(m); firingInstructor.fire(m); });
        updateButtonStates();
      } else {
        InfoBox.warn('Invalid .srt file', `Your subtitle file contains invalid fireworks commands (${wrong.join(', ')}). For the full list of valid commands, see <a href="https://github.com/Timendus/pyro-player/blob/master/shared/commands.js" target="_blank">here</a>.`);
      }
    });
  });

  function updateButtonStates() {
    if ( watcher.isReady() ) {
      srtButton.closest('label').classList.add('disabled');
      srtButton.disabled = 'disabled';
    }
    if ( player.isReady() ) {
      mediaButton.closest('label').classList.add('disabled');
      mediaButton.disabled = 'disabled';
    }
    if ( watcher.isReady() && player.isReady() ) {
      playButton.classList.remove('disabled');
    }
  }

});
