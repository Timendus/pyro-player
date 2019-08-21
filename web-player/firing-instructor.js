class FiringInstructor {

  constructor() {
    this.connection = new WebSocket('ws://127.0.0.1:8080', 'fireworks-protocol');
    this._bindEventHandlers();
  }

  invalidCommands(moments) {
    // The 'new Set' stuff is for 'unique'
    return [...new Set(moments.map((m) => m[1])
                              .filter((m) => !AllowedCommands.isValid(m)))];
  }

  fire(instruction) {
    this.connection.send(instruction);
  }

  _bindEventHandlers() {
    this.connection.addEventListener('open',    ()  => this._handleOpen());
    this.connection.addEventListener('error',   (e) => this._handleError(e));
    this.connection.addEventListener('message', (e) => this._handleMessage(e));
  }

  _handleOpen() {
    console.log('Opened connection magic');
    this.connection.send('test!');
  }

  _handleError(error) {
    console.error('Shit blew up:', error);
  }

  _handleMessage(message) {
    console.log(message);
  }

}
