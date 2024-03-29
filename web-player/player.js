class Player {

  constructor(element) {
    this.element = element;
    this.audio = new Audio();
    this._bindEventHandlers();
    this.ready = false;
  }

  loadFile(file) {
    this.audio.src = file;
    this.ready = true;
  }

  isReady() {
    return this.ready;
  }

  _bindEventHandlers() {
    this.element.addEventListener('click', (e) => this._handleClick(e)         );
    this.audio.addEventListener('playing', ()  => this._selectClass('playing') );
    this.audio.addEventListener('waiting', ()  => this._selectClass('waiting') );
    this.audio.addEventListener('error',   (e) => this._handleError(e)         );
    this.audio.addEventListener('ended',   ()  => this._selectClass('stopped') );
    this.audio.addEventListener('pause',   ()  => this._selectClass('stopped') );
  }

  _handleClick() {
    if ( !this.audio ) return;
    if ( this.audio.paused ) {
      this.audio.play();
    } else {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  _selectClass(c) {
    this.element.classList.remove('stopped','waiting','error','playing');
    this.element.classList.add(c);
  }

  _handleError(error) {
    this._selectClass('error');
    InfoBox.warn('An error occured in the media player', 'Maybe you chose an invalid file? See console for details.');
    console.error(error);
  }

}
