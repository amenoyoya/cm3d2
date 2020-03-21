const nexe = require('nexe');

/**
 * compile cm3d2_save2json.exe
 */
nexe.compile({
  input: './dist/cm3d2_save2json.js',
  output: './bin/cm3d2_save2json.exe',
  nodeVersion: '12.14.1',
  resources: []
}, err => {
  console.log(err);
});

/**
 * compile cm3d2_json2save.exe
 */
nexe.compile({
  input: './dist/cm3d2_json2save.js',
  output: './bin/cm3d2_json2save.exe',
  nodeVersion: '12.14.1',
  resources: []
}, err => {
  console.log(err);
});