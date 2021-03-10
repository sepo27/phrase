import { HttpClient } from '../../lib/http/main/HttpClient';
import { PhraseUri } from '../PhraseUri';
import { HttpForm } from '../../lib/http/form/HttpForm';
import { formDataFilename } from '../../lib/http/form';
import { LooseObject } from '../../lib/types';
import { isStr } from '../../lib/isType';
import { PhraseUploadsFileData } from './PhraseUploadsFileData';
import { PhraseUploadsOptions, PhraseUploadsPostOptions, PhraseUpload } from './types';

type PostInput = string | LooseObject;

export class PhraseUploadsClient {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private http: HttpClient, private options: PhraseUploadsOptions = {}) {}

  /*** Public ***/

  post(input: PostInput, options: PhraseUploadsPostOptions = {}): Promise<PhraseUpload> {
    let filename;

    if (isStr(input)) {
      filename = input;
    } else {
      filename = new PhraseUploadsFileData(input as LooseObject).toFile();
    }

    return this.http
      .post<PhraseUpload>(PhraseUri.UPLOADS, new HttpForm({
        ...this.makePostOptions(options),
        file: formDataFilename(filename),
      }))
      .then(res => res.data);
  }

  /*** Private ***/

  private makePostOptions(options) {
    const opts = { ...this.options.post, ...options };
    if (opts.tags) {
      opts.tags = Array.isArray(opts.tags) ? opts.tags.join(',') : opts.tags;
    }
    return opts;
  }
}
