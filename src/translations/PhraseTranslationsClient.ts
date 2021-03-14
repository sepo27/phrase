import { HttpClient } from '../../lib/http/main/HttpClient';
import { PhrasePager, PhrasePagerDefaultOptions } from '../PhrasePager';
import { BulkUnverifyTranslationsResData, PhraseTranslation } from './types';
import { PhraseUri } from '../PhraseUri';
import { PhraseWideSearch } from '../search/PhraseWideSearch';
import { PhraseTranslationsSearchQuery } from './PhraseTranslationsSearchQuery';
import { PhraseKeysSearchQuery } from '../keys/PhraseKeysSearchQuery';
import { PhraseKeysClient } from '../keys/PhraseKeysClient';
import { PhraseTranslationsKeyRef } from './PhraseTranslationsKeyRef';
import { PhraseTranslationsUnverifyQuery } from './PhraseTranslationsUnverifyQuery';
import { HttpMethod } from '../../lib/http/meta/HttpMethod';

interface ListOptions {
  search?: PhraseWideSearch<PhraseTranslationsSearchQuery>,
  perPage?: number,
}

export class PhraseTranslationsClient {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private http: HttpClient) {
    this.keys = new PhraseKeysClient(http);
  }

  /*** Public ***/

  public list(
    {
      search,
      // TODO: handle default perPage in Pager itself properly
      perPage: perPageOpt = PhrasePagerDefaultOptions.perPage,
    }: ListOptions = {},
  ): PhrasePager<PhraseTranslation> {
    const request = (page, perPage) => this.http
      .get<PhraseTranslation[]>(PhraseUri.TRANSLATIONS, {
        params: {
          ...(search && search.dump()),
          page,
          perPage,
        },
      })
      .then(res => res.data);

    return new PhrasePager<PhraseTranslation>(request, { perPage: perPageOpt });
  }

  /***
   * @param keyRef - Key id or name.
   */
  public listByKey(keyRef: string): PhrasePager<PhraseTranslation> {
    const ref = new PhraseTranslationsKeyRef(keyRef);
    let keyId: string;

    const request = async (page, perPage) => {
      if (ref.isName && page === 1) {
        const keys = await this.keys.list({
          search: new PhraseWideSearch().query(
            new PhraseKeysSearchQuery().name(ref.name),
          ),
        }).all();
        keyId = keys[0].id;
      } else if (!ref.isName) {
        keyId = ref.id;
      }

      return this.http
        .get<PhraseTranslation[]>(PhraseUri.keyTranslations(keyId), {
          params: { page, perPage },
        })
        .then(res => res.data);
    };

    return new PhrasePager<PhraseTranslation>(request);
  }

  public unverify(
    search: PhraseWideSearch<PhraseTranslationsUnverifyQuery>,
  ): Promise<BulkUnverifyTranslationsResData> {
    return this.http
      .request<BulkUnverifyTranslationsResData>(PhraseUri.translationsUnverify(), {
        method: HttpMethod.PATCH,
        form: search.dump(),
      })
      .then(res => res.data);
  }

  /*** Private ***/

  private keys: PhraseKeysClient;
}
