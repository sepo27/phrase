/* eslint-disable max-classes-per-file */

import { PhraseBaseSearch } from '../../src/search/PhraseBaseSearch';
import { PhraseBaseSearchQuery } from '../../src/search/PhraseBaseSearchQuery';

describe('PhraseBaseSearch', () => {
  it('provides adding param', () => {
    class TestSearch extends PhraseBaseSearch {
      foo(val: string) { this.addParam('foo', val); }
    }

    const search = new TestSearch();
    search.foo('bar');

    expect(search.dump()).toEqual({
      foo: 'bar',
    });
  });

  it('provides chaining when adding many params', () => {
    class TestSearch extends PhraseBaseSearch {
      foo(val: string) { return this.addParam('foo', val); }
      bar(val: string) { return this.addParam('bar', val); }
    }

    const search = new TestSearch()
      .foo('foo')
      .bar('bar');

    expect(search.dump()).toEqual({
      foo: 'foo',
      bar: 'bar',
    });
  });

  it('provides adding query', () => {
    class TestSearch extends PhraseBaseSearch {
    }

    class TestQuery extends PhraseBaseSearchQuery {
      foo(val: string) { return this.addParam('foo', val); }
    }

    const
      query = new TestQuery().foo('bar'),
      search = new TestSearch().query(query);

    expect(search.dump()).toEqual({
      q: query.dump(),
    });
  });
});
