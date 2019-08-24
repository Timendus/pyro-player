class Commands {}
Commands.isValid = (command) => Commands.getCode(command) !== undefined;
Commands.getCode = (command) => Commands.commandList[command];
Commands.commandList = {

  'fire 1':                         '5202065',
  'fire 2':                         '5202066',
  'fire 3':                         '5202067',
  'fire 4':                         '5202068',

  'fire 5':                         '5202069',
  'fire 6':                         '5202070',
  'fire 7':                         '5202071',
  'fire 8':                         '5202072',

  'fire 9':                         '5202073',
  'fire 10':                        '5202074',
  'fire 11':                        '5202075',
  'fire 12':                        '5202076',

  'fire 1 through 12 now':          '5202077',
  'fire 14':                        '5202078',
  'fire 1 through 15 in sequence':  '5202079',
  'fire 16':                        '5202080',

  'fire 17':                        '5202081',
  'fire 18':                        '5202082',
  'fire 19':                        '5202083',
  'fire 20':                        '5202084',

  'fire 21':                        '5202085',
  'fire 22':                        '5202086',
  'fire 23':                        '5202087',
  'fire 24':                        '5202088',

  'fire 25':                        '5202089',
  'fire 26':                        '5202090',
  'fire 27':                        '5202091',
  'fire 28':                        '5202092',

  'fire 18 through 25 now':         '5202093',
  'fire 30':                        '5202094',
  'fire 18 through 27 in sequence': '5202095',
  'fire 32':                        '5202096',

  'fire 33':                        '5202097',
  'fire 34':                        '5202098',
  'fire 35':                        '5202099',
  'fire 36':                        '5202100',

  'fire 37':                        '5202101',
  'fire 38':                        '5202102',
  'fire 39':                        '5202103',
  'fire 40':                        '5202104',

  'fire 41':                        '5202105',
  'fire 42':                        '5202106',
  'fire 43':                        '5202107',
  'fire 44':                        '5202108',

  'fire 33 through 44 now':         '5202109',
  'fire 46':                        '5202110',
  'fire 33 through 44 in sequence': '5202111'

};

// Export for nodejs
if (typeof module === 'undefined') module = {};
module.exports = Commands;
