window.addEventListener('load', function() {
  const playButton  = document.querySelector('button.play');
  const srtButton   = document.querySelector('#subtitles');
  const mediaButton = document.querySelector('#media');

  let audio         = null;
  let interval      = null;
  let subtitles     = null;
  let subtitleIndex = 0;

  mediaButton.addEventListener('change', (e) => {
    _readFile(e.target.files[0], true).then((r) => {
      audio = new Audio(r);
      updateButtonStates();
    });
  });

  srtButton.addEventListener('change', (e) => {
    _readFile(e.target.files[0]).then((r) => {
      let match, subs = [];
      let iterator = r.matchAll(/\d\n(\d+):(\d+):(\d+),(\d+)\s.*\n(.*)\n/g);

      // TODO: is this the best way to iterate over regexp matches?
      while ( !(match = iterator.next()).done ) {
        let [_, h, m, s, ms, value] = match.value;
        const label = 3600*h + 60*m + 1*s + 0.001*ms;
        subs.push([label, value]);
      }

      subtitles = subs;
      updateButtonStates();
    });
  });

  playButton.addEventListener('click', function() {
    if ( audio.paused ) {
      connectAudioEvents();
      startAudioWatcher();
      // TODO: fix catch
      try {
        audio.play();
      } catch(e) {
        removeAudioEvents();
        stopAudioWatcher();
        selectError();
        audio.currentTime = 0;
      }
    } else {
      audio.pause();
      removeAudioEvents();
      stopAudioWatcher()
      selectStopped();
      audio.currentTime = 0;
    }
  });

  /*** Functions ***/

  function updateButtonStates() {
    if ( subtitles ) {
      srtButton.closest('label').classList.add('disabled');
      srtButton.disabled = 'disabled';
    }
    if ( audio ) {
      mediaButton.closest('label').classList.add('disabled');
      mediaButton.disabled = 'disabled';
    }
    if ( subtitles && audio ) {
      playButton.classList.remove('disabled');
    }
  }

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
      if ( !subtitles || subtitleIndex == subtitles.length ) return;
      if ( audio.currentTime > subtitles[subtitleIndex][0] ) {
        // TODO: send command to raspberry pi / Arduino board
        console.log(subtitles[subtitleIndex][1]);
        subtitleIndex++;
      }
    }, 50);
  }

  function stopAudioWatcher() {
    window.clearInterval(interval);
  }

  function _readFile(file, binary=false) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener('load', (e) => resolve(e.target.result));
      if ( binary )
        reader.readAsDataURL(file);
      else
        reader.readAsText(file);
    });
  }

});
