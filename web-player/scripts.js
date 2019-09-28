window.addEventListener('load', function() {
  const playButton  = document.querySelector('button.play');
  const srtButton   = document.querySelector('#subtitles');
  const mediaButton = document.querySelector('#media');

  const player           = new Player(playButton);
  const fireWatcher      = new PlayerWatcher(player, 0.3);
  const showWatcher      = new PlayerWatcher(player, 0.0);
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
        fireWatcher.setCallbackMoments(file.contents, (m) => firingInstructor.fire(m));
        showWatcher.setCallbackMoments(file.contents, (m) => InfoBox.showAndFade(m));
        updateButtonStates();
      } else {
        InfoBox.warn('Invalid .srt file', `Your subtitle file contains invalid fireworks commands (${wrong.join(', ')}). For the full list of valid commands, see <a href="https://github.com/Timendus/pyro-player/blob/master/shared/commands.js" target="_blank">here</a>.`);
      }
    });
  });

  function updateButtonStates() {
    if ( fireWatcher.isReady() && showWatcher.isReady() ) {
      srtButton.closest('label').classList.add('disabled');
      srtButton.disabled = 'disabled';
    }
    if ( player.isReady() ) {
      mediaButton.closest('label').classList.add('disabled');
      mediaButton.disabled = 'disabled';
    }
    if ( fireWatcher.isReady() && showWatcher.isReady() && player.isReady() ) {
      playButton.classList.remove('disabled');
    }
  }

});
