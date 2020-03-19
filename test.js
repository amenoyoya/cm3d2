const fs = require('fs');

const main = async () => {
  /*const content = fs.readFileSync('./SaveData026.save');
  console.log(new DataView(content));*/
  const buf = Buffer.from('test');
  console.log(buf[0]);
};
main();