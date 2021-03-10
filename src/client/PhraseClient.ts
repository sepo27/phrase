import { PhraseClientConfig } from './types';
import { HttpClient } from '../../lib/http/main/HttpClient';
import { PhraseUri } from '../PhraseUri';
import { PhraseUploadsClient } from '../uploads/PhraseUploadsClient';
import { PhraseKeysClient } from '../keys/PhraseKeysClient';
import { PhraseTranslationsClient } from '../translations/PhraseTranslationsClient';

export class PhraseClient {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(config: PhraseClientConfig) {
    this.http = new HttpClient({
      baseURL: PhraseUri.toProject(config.projectId),
      headers: {
        Authorization: `token ${config.accessToken}`,
      },
    });

    this.uploads = new PhraseUploadsClient(this.http, config.uploads);
    this.keys = new PhraseKeysClient(this.http);
    this.translations = new PhraseTranslationsClient(this.http);
  }

  /*** Public ***/

  public readonly uploads: PhraseUploadsClient;
  public readonly keys: PhraseKeysClient;
  public readonly translations: PhraseTranslationsClient;

  /*** Private ***/

  private http: HttpClient;
}
