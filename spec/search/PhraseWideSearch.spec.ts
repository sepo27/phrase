import { PhraseWideSearch } from '../../src/search/PhraseWideSearch';
import { PhraseOrder, PhraseWideSort } from '../../src/search/constants';

describe('PhraseWideSearch', () => {
  let search: PhraseWideSearch;

  beforeEach(() => {
    search = new PhraseWideSearch();
  });

  it('with branch', () => {
    expect(search.branch('foo').dump()).toEqual({
      branch: 'foo',
    });
  });

  it('with sort by name', () => {
    expect(search.sort(PhraseWideSort.NAME).dump()).toEqual({
      sort: PhraseWideSort.NAME,
    });
  });

  it('with order', () => {
    expect(search.order(PhraseOrder.ASC).dump()).toEqual({
      order: PhraseOrder.ASC,
    });
  });
});
