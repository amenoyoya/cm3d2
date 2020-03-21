/**
 * CLI: .json を .save に変換
 * @usage ts-node cm3d2_json2save <変換対象ファイル>
 * @output 変換対象ファイルと同じディレクトリに <ファイル名>.save が作成される
 */
import * as path from 'path';
import * as fs from 'fs';
import {CM3D2Writer} from './lib/cm3d2/writer';

const main = async () => {
  if (process.argv.length < 3) {
    console.error('変換対象のJSONファイルを指定してください');
    return false;
  }
  const fullpath = path.resolve(process.argv[2]); // 変換対象ファイル
  const dir = path.dirname(fullpath);
  const name = path.basename(fullpath, path.extname(fullpath)); // 拡張子抜きのファイル名
  const savepath = path.resolve(path.join(dir, `${name}.save`)); // 保存先
  const cm3d2 = new CM3D2Writer();
  const json = JSON.parse(fs.readFileSync(fullpath, 'utf-8'));
  const data = cm3d2.exportSaveData(json); // JSONをセーブデータに変換
  fs.writeFileSync(savepath, data);
  console.log(savepath, 'に変換しました');
  return true;
};

main();