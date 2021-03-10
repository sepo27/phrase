import { PhraseTBench } from '../bench/PhraseTBench';
import { PhraseUri } from '../../src/PhraseUri';
import { PhraseKeysClient } from '../../src/keys/PhraseKeysClient';
import { manyPhraseKeysGen } from './phraseKeyGen';
import { PhrasePager, PhrasePagerDefaultOptions } from '../../src/PhrasePager';
import { httpResponseGen } from '../../lib/http/_spec/httpResponseGen';
import { PhraseWideSearch } from '../../src/search/PhraseWideSearch';
import { PhraseKeysSearchQuery } from '../../src/keys/PhraseKeysSearchQuery';

describe('PhraseKeysClient', () => {
  let bench: PhraseTBench;

  beforeEach(() => {
    bench = new PhraseTBench();
  });

  afterEach(() => {
    bench.restore();
  });

  it('list() resolves with pages', async () => {
    const perPage = PhrasePagerDefaultOptions.perPage;

    bench.mock.http.get
      .onFirstCall()
      .resolves(httpResponseGen({
        data: manyPhraseKeysGen([{ id: '123' }]),
      }))
      .resolves(httpResponseGen({
        data: [],
      }));

    const listRes = keys().list();

    expect(listRes).toBeInstanceOf(PhrasePager);

    const res = await listRes.all();

    expect(bench.mock.http.get.calledTwice).toBeTruthy();
    expect(bench.mock.http.get.getCall(0).args).toMatchObject([
      PhraseUri.KEYS,
      {
        params: {
          page: 1,
          perPage,
        },
      },
    ]);

    expect(bench.mock.http.get.getCall(1).args).toMatchObject([
      PhraseUri.KEYS,
      {
        params: {
          page: 2,
          perPage,
        },
      },
    ]);

    expect(res).toMatchObject([{
      id: '123',
    }]);
  });

  it('list() with search', () => {
    const search = new PhraseWideSearch()
      .branch('foo')
      .query(new PhraseKeysSearchQuery().ids(['1', '2']));

    bench.mock.http.get.resolves(httpResponseGen({ data: [] }));

    keys().list({ search }).all();

    expect(bench.mock.http.get.calledOnce).toBeTruthy();
    expect(bench.mock.http.get.getCall(0).args[1]).toMatchObject({
      params: search.dump(),
    });
  });

  /*** Lib ***/

  function keys() {
    return new PhraseKeysClient(bench.mock.http);
  }
});
