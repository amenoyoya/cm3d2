import * as fs from 'fs';
import {CM3D2Reader} from '../lib/cm3d2/reader';
import {CM3D2Writer} from '../lib/cm3d2/writer';

const read = async () => {
  const buffer = fs.readFileSync('./SaveData021.save');
  console.log(buffer);
  
  const cm3d2 = new CM3D2Reader(buffer);
  const data = cm3d2.parseSaveData();
  console.log(data);

  fs.writeFileSync('./SaveData021.json', JSON.stringify(data, null, '  '));
};

const write = async () => {
  const data = JSON.parse(fs.readFileSync('./SaveData021.json', 'utf-8'));
  const cm3d2 = new CM3D2Writer();
  const buffer = cm3d2.exportSaveData(data);

  console.log(buffer);
  fs.writeFileSync('./SaveData022.save', buffer);
};

// read();
write();
