/**
 * CLI: .save を .json に変換
 * @usage ts-node cm3d2_save2json <変換対象ファイル>
 * @output 変換対象ファイルと同じディレクトリに <ファイル名>.json が作成される
 */
import * as path from 'path';
import * as fs from 'fs';
import {CM3D2Reader} from './lib/cm3d2/reader';

const main = async () => {
  if (process.argv.length < 3) {
    console.error('変換対象のセーブデータファイルを指定してください');
    return false;
  }
  const fullpath = path.resolve(process.argv[2]); // 変換対象ファイル
  const dir = path.dirname(fullpath);
  const name = path.basename(fullpath, path.extname(fullpath)); // 拡張子抜きのファイル名
  const savepath = path.resolve(path.join(dir, `${name}.json`)); // 保存先
  const cm3d2 = new CM3D2Reader(fs.readFileSync(fullpath));
  const json = cm3d2.parseSaveData(); // セーブデータをJSONに変換
  fs.writeFileSync(savepath, JSON.stringify(json, null, '  '));
  console.log(savepath, 'に変換しました');
  return true;
};

main();