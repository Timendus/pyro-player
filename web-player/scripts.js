window.addEventListener('load', function() {
  const playButton  = document.querySelector('button.play');
  const srtButton   = document.querySelector('#subtitles');
  const mediaButton = document.querySelector('#media');

  let audio         = null;
  let interval      = null;
  let subtitles     = null;
  let subtitleIndex = 0;

  mediaButton.addEventListener('change', (e) => {
    readFile({
      file: e.target.files[0],
      binary: true
    })
    .then((r) => {
      audio = new Audio(r);
      connectAudioEvents();
      updateButtonStates();
    });
  });

  srtButton.addEventListener('change', (e) => {
    readFile({
      file: e.target.files[0],
      binary: false
    })
    .then((r) => {
      subtitles = parseSRTFile(r);
      updateButtonStates();
    });
  });

  playButton.addEventListener('click', function() {
    if ( audio.paused ) {
      // TODO: fix catch
      try {
        audio.play();
      } catch(e) {
        selectError();
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  });

  /*** Functions ***/

  function parseSRTFile(file) {
    let match, subs = [];
    let iterator = file.matchAll(/\d\n(\d+):(\d+):(\d+),(\d+)\s.*\n(.*)\n/g);

    // TODO: is this the best way to iterate over regexp matches?
    while ( !(match = iterator.next()).done ) {
      let [_, h, m, s, ms, value] = match.value;
      const label = 3600*h + 60*m + 1*s + 0.001*ms;
      subs.push([label, value]);
    }

    return subs;
  }

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

  function events(callback) {
    [
      [ 'playing', () => { selectClass('playing'); startAudioWatcher(); } ],
      [ 'waiting', () => { selectClass('waiting'); } ],
      [ 'error',   () => { selectClass('error'); } ],
      [ 'ended',   () => { selectClass('stopped'); stopAudioWatcher(); } ],
      [ 'pause',   () => { selectClass('stopped'); stopAudioWatcher(); } ]
    ].forEach(callback);
  }

  function connectAudioEvents() {
    events(([e,m]) => audio.addEventListener(e,m));
  }

  function removeAudioEvents() {
    events(([e,m]) => audio.removeEventListener(e,m));
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
    subtitleIndex = 0;
  }

  function readFile({file, binary}) {
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
