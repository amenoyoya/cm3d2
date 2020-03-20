import * as fs from 'fs';
import {CM3D2} from './lib/cm3d2';

const main = async () => {
  const buffer = fs.readFileSync('./SaveData026.save');
  console.log(buffer);
  
  const cm3d2 = new CM3D2(buffer);
  const data = cm3d2.parseSaveData();
  console.log(data);

  fs.writeFileSync('./SaveData026.json', JSON.stringify(data, null, '  '));
};
main();