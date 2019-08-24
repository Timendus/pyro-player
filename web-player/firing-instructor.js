class FiringInstructor {

  constructor() {
    const protocol = location.protocol == 'https:' ? 'wss:' : 'ws:';
    this.connection = new WebSocket(`${protocol}//${location.host}`, 'fireworks-protocol');
    this._bindEventHandlers();
  }

  invalidCommands(moments) {
    // The 'new Set' stuff is for 'unique'
    return [...new Set(moments.map((m) => m[1])
                              .filter((m) => !Commands.isValid(m)))];
  }

  fire(instruction) {
    this.connection.send(instruction);
  }

  _bindEventHandlers() {
    this.connection.addEventListener('open',    ()  => this._handleOpen());
    this.connection.addEventListener('error',   (e) => this._handleError(e));
  }

  _handleOpen() {
    console.log('Opened connection magic');
  }

  _handleError(error) {
    console.error(error);
    InfoBox.warn('An error occured connecting to the back-end', error);

  }

}
