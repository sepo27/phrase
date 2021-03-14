import { PhraseTBench } from '../bench/PhraseTBench';
import { PhrasePager, PhrasePagerDefaultOptions } from '../../src/PhrasePager';
import { httpResponseGen } from '../../lib/http/_spec/httpResponseGen';
import { manyPhraseTranslationsGen, phraseTranslationGen } from './phraseTranslationGen';
import { PhraseUri } from '../../src/PhraseUri';
import { PhraseTranslationsClient } from '../../src/translations/PhraseTranslationsClient';
import { PhraseWideSearch } from '../../src/search/PhraseWideSearch';
import { PhraseTranslationsSearchQuery } from '../../src/translations/PhraseTranslationsSearchQuery';
import { phraseKeyGen } from '../keys/phraseKeyGen';
import { PhraseKeysSearchQuery } from '../../src/keys/PhraseKeysSearchQuery';
import { PhraseTranslationsKeyRef } from '../../src/translations/PhraseTranslationsKeyRef';

describe('PhraseTranslationsClient', () => {
  let bench: PhraseTBench;

  beforeEach(() => {
    bench = new PhraseTBench();
    bench.mock.http.get.resolves(httpResponseGen({ data: [] }));
  });

  afterEach(() => {
    bench.restore();
  });

  it('list() resolves with pagination', async () => {
    const perPage = PhrasePagerDefaultOptions.perPage;

    bench.mock.http.get
      .onFirstCall()
      .resolves(httpResponseGen({
        data: manyPhraseTranslationsGen([{ id: '321' }]),
      }));

    const listRes = client().list();

    expect(listRes).toBeInstanceOf(PhrasePager);

    const res = await listRes.all();

    expect(bench.mock.http.get.calledTwice).toBeTruthy();
    expect(bench.mock.http.get.getCall(0).args).toMatchObject([
      PhraseUri.TRANSLATIONS,
      {
        params: {
          page: 1,
          perPage,
        },
      },
    ]);
    expect(bench.mock.http.get.getCall(1).args).toMatchObject([
      PhraseUri.TRANSLATIONS,
      {
        params: {
          page: 2,
          perPage,
        },
      },
    ]);

    expect(res).toMatchObject([{
      id: '321',
    }]);
  });

  it('list() with search', () => {
    const search = new PhraseWideSearch()
      .branch('bar')
      .query(
        new PhraseTranslationsSearchQuery()
          .id(['foo'])
          .tags('TheFox'),
      );

    client().list({ search }).all();

    expect(bench.mock.http.get.calledOnce).toBeTruthy();
    expect(bench.mock.http.get.getCall(0).args[1]).toMatchObject({
      params: {
        ...search.dump(),
      },
    });
  });

  it('list() with per page', () => {
    bench.mock.phrase.pager.$constructor;

    client().list({ perPage: 10 });

    expect(bench.mock.phrase.pager.$constructor.calledOnce).toBeTruthy();
    expect(bench.mock.phrase.pager.$constructor.getCall(0).args[1]).toMatchObject({
      perPage: 10,
    });
  });

  it('listByKey() with key id', async () => {
    const keyId = 'abcd';

    bench.mock.phrase.keys.list;

    await client().listByKey(keyId).all();

    expect(bench.mock.phrase.keys.list.callCount).toBe(0);
    expect(bench.mock.http.get.calledOnce).toBeTruthy();
    expect(bench.mock.http.get.getCall(0).args[0]).toEqual(
      PhraseUri.keyTranslations(keyId),
    );
  });

  it('listByKey() with key id resolves with pagination', async () => {
    const
      keyId = 'bazzzyyyy',
      translationId = 'fooTranslationId',
      perPage = PhrasePagerDefaultOptions.perPage;

    bench.mock.http.get
      .withArgs(PhraseUri.keyTranslations(keyId))
      .onFirstCall()
      .resolves(httpResponseGen({
        data: manyPhraseTranslationsGen([
          { id: translationId },
        ]),
      }));

    const callRes = client().listByKey(keyId);
    expect(callRes).toBeInstanceOf(PhrasePager);

    const res = await callRes.all();

    expect(bench.mock.http.get.calledTwice).toBeTruthy();
    expect(bench.mock.http.get.getCall(0).args[1]).toMatchObject({
      params: { page: 1, perPage },
    });
    expect(bench.mock.http.get.getCall(1).args[1]).toMatchObject({
      params: { page: 2, perPage },
    });
    expect(res).toMatchObject([{
      id: translationId,
    }]);
  });

  it('listByKey() with key name', async () => {
    const
      key = phraseKeyGen({
        id: '3334567',
        name: 'TheFoo&Bar',
      }),
      nameRef = PhraseTranslationsKeyRef.makeNameRef(key.name);

    bench.mock.phrase.keys.list.returns(new PhrasePager(
      (page) => {
        if (page === 1) {
          return Promise.resolve([key]);
        }
        return Promise.resolve([]);
      },
    ));

    await client().listByKey(nameRef).all();

    expect(bench.mock.phrase.keys.list.calledOnce).toBeTruthy();
    expect(bench.mock.phrase.keys.list.getCall(0).args).toMatchObject([{
      search: new PhraseWideSearch().query(
        new PhraseKeysSearchQuery().name(key.name),
      ),
    }]);
    expect(bench.mock.http.get.calledOnce).toBeTruthy();
    expect(bench.mock.http.get.getCall(0).args[0]).toBe(PhraseUri.keyTranslations(key.id));
  });

  it('list by key with key name resolves with pagination', async () => {
    const
      key = phraseKeyGen({
        id: '12333',
        name: 'FooKey',
      }),
      nameRef = PhraseTranslationsKeyRef.makeNameRef(key.name),
      translation1 = phraseTranslationGen({
        id: '333',
      }),
      translation2 = phraseTranslationGen({
        id: '555',
      });

    bench.mock.phrase.keys.list.returns(new PhrasePager(
      (page) => {
        if (page === 1) {
          return Promise.resolve([key]);
        }
        return Promise.resolve([]);
      },
    ));
    bench.mock.http.get
      .onFirstCall()
      .resolves(httpResponseGen({
        data: [translation1],
      }))
      .onSecondCall()
      .resolves(httpResponseGen({
        data: [translation2],
      }));

    const clientRes = client().listByKey(nameRef);
    expect(clientRes).toBeInstanceOf(PhrasePager);

    const res = await clientRes.all();

    expect(bench.mock.http.get.calledThrice).toBeTruthy();

    expect(bench.mock.http.get.getCall(0).args).toMatchObject([
      PhraseUri.keyTranslations(key.id),
      { params: { page: 1 } },
    ]);
    expect(bench.mock.http.get.getCall(1).args).toMatchObject([
      PhraseUri.keyTranslations(key.id),
      { params: { page: 2 } },
    ]);
    expect(bench.mock.http.get.getCall(2).args).toMatchObject([
      PhraseUri.keyTranslations(key.id),
      { params: { page: 3 } },
    ]);

    expect(res).toEqual([translation1, translation2]);
  });

  /*** Lib ***/

  function client() {
    return new PhraseTranslationsClient(bench.mock.http);
  }
});
