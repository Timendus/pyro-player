class PlayerWatcher {

  constructor(player) {
    this.player          = player;
    this.interval        = null;
    this.callbackMoments = [];
    this.callbackIndex   = 0;
    this.ready           = false;
    this._bindAudioEventHandlers();
  }

  setCallbackMoments(moments, callback) {
    this.callbackMoments  = moments;
    this.callbackFunction = callback;
    this.ready = true;
  }

  isReady() {
    return this.ready;
  }

  _bindAudioEventHandlers() {
    this.player.audio.addEventListener('playing', () => this._startWatching() );
    this.player.audio.addEventListener('error',   () => this._stopWatching()  );
    this.player.audio.addEventListener('ended',   () => this._stopWatching()  );
    this.player.audio.addEventListener('pause',   () => this._stopWatching()  );
  }

  _startWatching() {
    this.interval = window.setInterval(() => this._checkMoments(), 50);
  }

  _stopWatching() {
    window.clearInterval(this.interval);
    this.callbackIndex = 0;
  }

  _checkMoments() {
    const [ index, moments ] = [ this.callbackIndex, this.callbackMoments ];
    if ( index == moments.length ) return;

    if ( this.player.audio.currentTime > moments[index][0] ) {
      this.callbackFunction(moments[index][1]);
      this.callbackIndex++;
    }
  }

}
