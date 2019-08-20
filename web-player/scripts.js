window.addEventListener('load', function() {
  const playButton  = document.querySelector('button.play');
  const srtButton   = document.querySelector('#subtitles');
  const mediaButton = document.querySelector('#media');

  const player = new Player(playButton);
  const watcher = new PlayerWatcher(player);

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
      // TODO: send command to raspberry pi / Arduino board
      watcher.setCallbackMoments(file.contents, (m) => console.log(m));
      updateButtonStates();
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
