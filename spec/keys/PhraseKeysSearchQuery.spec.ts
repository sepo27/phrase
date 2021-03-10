import { PhraseBaseSearchQuery } from '../../src/search/PhraseBaseSearchQuery';
import { PhraseKeysSearchQuery } from '../../src/keys/PhraseKeysSearchQuery';
import { PhraseDateOperator } from '../../src/search/constants';

describe('PhraseKeysSearchQuery', () => {
  let query: PhraseKeysSearchQuery;

  beforeEach(() => {
    query = new PhraseKeysSearchQuery();
  });

  it('to extend base query', () => {
    expect(query).toBeInstanceOf(PhraseBaseSearchQuery);
  });

  it('with ids', () => {
    expect(query.ids(['1', '2']).dump()).toBe('ids:1,2');
  });

  it('with name', () => {
    expect(query.name('foo').dump()).toBe('name:foo');
  });

  it('with tags', () => {
    expect(query.tags(['foo', 'bar']).dump()).toBe('tags:foo,bar');
  });

  it('with is translated', () => {
    expect(query.isTranslated().dump()).toBe('translated:true');
  });

  it('with is not translated', () => {
    expect(query.isNotTranslated().dump()).toBe('translated:false');
  });

  it('with updated at GT', () => {
    expect(query.updatedAtGt(new Date('2013-02-21T00:00:00Z')).dump())
      .toBe(`updated_at:${PhraseDateOperator.GT}2013-02-21T00:00:00Z`);
  });

  it('with updated at LT', () => {
    expect(query.updatedAtLt(new Date('2013-02-21T00:00:00Z')).dump())
      .toBe(`updated_at:${PhraseDateOperator.LT}2013-02-21T00:00:00Z`);
  });

  it('with upated at range', () => {
    expect(
      query.updatedAt(
        new Date('2013-02-21T00:00:00Z'),
        new Date('2013-02-23T23:59:59Z'),
      ).dump(),
    ).toBe('updated_at:>=2013-02-21T00:00:00Z%20updated_at:<=2013-02-23T23:59:59Z');
  });

  it('with unmentioned in upload', () => {
    expect(query.unmentionedInUpload(['foo', 'bar']).dump()).toBe('unmentioned_in_upload:foo,bar');
  });
});
