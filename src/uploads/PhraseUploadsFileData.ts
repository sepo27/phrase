import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import * as objectHash from 'object-hash';
import { LooseObject } from '../../lib/types';

export class PhraseUploadsFileData {
  /*** Public static ***/

  static readonly DIR = path.join(os.tmpdir(), 'phrase');

  static filename(data: LooseObject): string {
    return path.join(
      PhraseUploadsFileData.DIR,
      `${new Date().getTime()}_${objectHash(data)}.json`,
    );
  }

  /*** Constructor ***/

  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private data: LooseObject) {}

  /*** Public ***/

  toFile(): string {
    const filename = PhraseUploadsFileData.filename(this.data);
    if (!fs.existsSync(PhraseUploadsFileData.DIR)) {
      fs.mkdirSync(PhraseUploadsFileData.DIR);
    }
    fs.writeJsonSync(filename, this.data);
    return filename;
  }
}
