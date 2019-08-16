window.addEventListener('load', function() {
  var audio         = null;
  var interval      = null;
  var playButton    = document.querySelector('button.play');
  var srtButton     = document.querySelector('#subtitles');
  let subtitles     = null;
  let subtitleIndex = 0;

  srtButton.addEventListener('change', (e) => {
    _readFile(e.target.files[0]).then((r) => {

      // Ugly code to reduce subtitle file to hash { time: text }
      let subs = r.split('\n\n');
      subs = subs.map((s) => s.split('\n'));
      subs = subs.reduce((o,[x,k,v,y]) => {
        if ( !k ) return o;
        k = k.split(' ')[0];
        let [seconds, subseconds] = k.split(',');
        seconds = seconds.split(':');
        k = 3600*seconds[0] + 60*seconds[1] + 1*seconds[2] + 0.001*subseconds;
        return (o[k]=v,o)
      }, {});

      // Store new hash for later use
      subtitles = subs;

      // Update interface
      srtButton.closest('label').classList.add('disabled');
      srtButton.disabled = 'disabled';
      playButton.classList.remove('disabled');
    });
  });

  playButton.addEventListener('click', function() {
    if (audio == null) {
      audio = new Audio('media/music-file.mp3');
      connectAudioEvents();
      startAudioWatcher();
      audio.play();
    } else {
      audio.pause();
      removeAudioEvents();
      stopAudioWatcher()
      audio.currentTime = 0;
      audio.src = '';
      audio = null;
      interval = null;
      selectStopped();
    }
  });

  function selectClass(className) {
    playButton.classList.remove('stopped','waiting','error','playing');
    playButton.classList.add(className);
  }

  function selectWaiting() { selectClass('waiting'); }
  function selectStopped() { selectClass('stopped'); subtitleIndex = 0; }
  function selectError()   { selectClass('error');   }
  function selectPlaying() { selectClass('playing'); }

  function connectAudioEvents() {
    audio.addEventListener('playing', selectPlaying);
    audio.addEventListener('waiting', selectWaiting);
    audio.addEventListener('error',   selectError);
    audio.addEventListener('ended',   selectStopped);
  }

  function removeAudioEvents() {
    audio.removeEventListener('playing', selectPlaying);
    audio.removeEventListener('waiting', selectWaiting);
    audio.removeEventListener('error',   selectError);
    audio.removeEventListener('ended',   selectStopped);
  }

  function startAudioWatcher() {
    interval = window.setInterval(() => {
      if ( !subtitles ) return;
      if ( audio.currentTime > Object.keys(subtitles)[subtitleIndex] ) {
        let key = Object.keys(subtitles)[subtitleIndex];
        subtitleIndex++;

        // TODO: send command to raspberry pi / Arduino board
        console.log(subtitles[key]);
      }
    }, 100);
  }

  function stopAudioWatcher() {
    window.clearInterval(interval);
  }

  function _readFile(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener('load', (e) => resolve(e.target.result));
      reader.readAsText(file);
    });
  }

  selectStopped();
});
