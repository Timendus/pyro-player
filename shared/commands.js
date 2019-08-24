class Commands {}
Commands.isValid = (command) => Commands.getCode(command) !== undefined;
Commands.getCode = (command) => Commands.commandList[command];
Commands.commandList = {
  'fire 1':                         '386758',
  'fire 2':                         '386758',
  'fire 3':                         '386758',
  'fire 4':                         '386758',
  'fire 5':                         '386758',
  'fire 6':                         '386758',
  'fire 7':                         '386758',
  'fire 8':                         '386758',
  'fire 9':                         '386758',
  'fire 10':                        '386758',
  'fire 11':                        '386758',
  'fire 12':                        '386758',
  'fire 1 through 12 now':          '386758',
  'fire 1 through 15 in sequence':  '386758',
  'fire 14':                        '386758',
  'fire 16':                        '386758',
  'fire 17':                        '386758',
  'fire 18':                        '386758',
  'fire 19':                        '386758',
  'fire 20':                        '386758',
  'fire 21':                        '386758',
  'fire 22':                        '386758',
  'fire 23':                        '386758',
  'fire 24':                        '386758',
  'fire 25':                        '386758',
  'fire 18 through 25 now':         '386758',
  'fire 18 through 27 in sequence': '386758',
  'fire 26':                        '386758',
  'fire 27':                        '386758',
  'fire 28':                        '386758',
  'fire 30':                        '386758',
  'fire 32':                        '386758'
};

// Export for nodejs
if (typeof module === 'undefined') module = {};
module.exports = Commands;
