import { HttpClient } from '../../lib/http/main/HttpClient';
import { PhraseUri } from '../PhraseUri';
import { PhrasePager } from '../PhrasePager';
import { PhraseKey } from './types';
import { PhraseWideSearch } from '../search/PhraseWideSearch';
import { PhraseKeysSearchQuery } from './PhraseKeysSearchQuery';

interface ListOptions {
  search?: PhraseWideSearch<PhraseKeysSearchQuery>,
}

export class PhraseKeysClient {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private http: HttpClient) {}

  list({ search }: ListOptions = {}): PhrasePager<PhraseKey> {
    const request = (page, perPage) => this.http
      .get<PhraseKey[]>(PhraseUri.KEYS, {
        params: {
          ...(search && search.dump()),
          page,
          perPage,
        },
      })
      .then(res => res.data);

    return new PhrasePager(request);
  }
}
