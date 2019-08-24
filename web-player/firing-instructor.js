class FiringInstructor {

  constructor() {
    this.connection = new WebSocket(`ws://${location.host}`, 'fireworks-protocol');
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
    console.error('Shit blew up:', error);
  }

}
