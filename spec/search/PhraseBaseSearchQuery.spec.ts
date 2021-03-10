/* eslint-disable max-classes-per-file */

import { PhraseBaseSearchQuery } from '../../src/search/PhraseBaseSearchQuery';
import { PhraseDateOperator } from '../../src/search/constants';

describe('PhraseBaseSearchQuery', () => {
  it('provides adding term param', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      foo(val: string) { this.addTerm(val); }
    }

    const query = new TestQuery();
    query.foo('myTerm');

    expect(query.dump()).toBe('myTerm');
  });

  it('provides adding value param', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      foo(val: string) { this.addParam('foo', val); }
    }

    const query = new TestQuery();
    query.foo('bar');

    expect(query.dump()).toBe('foo:bar');
  });

  it('provides chaining adding term & value param', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      foo(val: string) { return this.addTerm(val); }
      bar(val: string) { return this.addParam('bar', val); }
    }

    const query = new TestQuery()
      .foo('fooTerm')
      .bar('TheBar');

    expect(query.dump()).toBe('fooTerm%20bar:TheBar');
  });

  it('provides term in the beginning always', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      foo(val: string) { return this.addTerm(val); }
      bar(val: string) { return this.addParam('bar', val); }
    }

    const query = new TestQuery()
      .bar('TheBar')
      .foo('fooTerm');

    expect(query.dump()).toBe('fooTerm%20bar:TheBar');
  });

  it('provides adding multi val param', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      foo(val: string[]) { return this.addMultiParam('foo', val); }
    }

    const query = new TestQuery().foo(['bar', 'baz']);

    expect(query.dump()).toBe('foo:bar,baz');
  });

  it('provides adding boolean param', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      foo(val: boolean) { return this.addBooleanParam('foo', val); }
    }

    const query = new TestQuery().foo(true);

    expect(query.dump()).toBe('foo:true');
  });

  it('provides adding GT date param', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      updatedAtGt(val: Date) { return this.addDateParam('updatedAt', val, PhraseDateOperator.GT); }
    }

    const date = new Date('2013-02-21T00:00:00Z');
    const query = new TestQuery().updatedAtGt(date);

    expect(query.dump()).toBe(`updatedAt:${PhraseDateOperator.GT}2013-02-21T00:00:00Z`);
  });

  it('provides adding LT date param', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      updatedAtLt(val: Date) { return this.addDateParam('updatedAt', val, PhraseDateOperator.LT); }
    }

    const date = new Date('2013-02-21T00:00:00Z');
    const query = new TestQuery().updatedAtLt(date);

    expect(query.dump()).toBe(`updatedAt:${PhraseDateOperator.LT}2013-02-21T00:00:00Z`);
  });

  it('provides adding range date param', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      range(from: Date, to: Date) {
        return this.addDateRangeParam('date', from, to);
      }
    }

    const
      from = new Date('2013-02-21T00:00:00Z'),
      to = new Date('2013-02-23T23:59:59Z'),
      query = new TestQuery().range(from, to);

    expect(query.dump())
      .toBe('date:>=2013-02-21T00:00:00Z%20date:<=2013-02-23T23:59:59Z');
  });

  it('provides is empty verification', () => {
    class TestQuery extends PhraseBaseSearchQuery {}

    expect(new TestQuery().isEmpty).toBeTruthy();
  });

  it('provides is empty verification on non-empty query', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      foo(val: string) { return this.addParam('foo', val); }
    }

    expect(new TestQuery().foo('some').isEmpty).toBeFalsy();
  });

  it('provides adding mixed params', () => {
    class TestQuery extends PhraseBaseSearchQuery {
      term(val: string) { return this.addTerm(val); }
      foo(val: string) { return this.addParam('foo', val); }
      bar(val: string[]) { return this.addMultiParam('bar', val); }
    }

    const query = new TestQuery()
      .term('searchTerm')
      .foo('TheFoo')
      .bar(['And', 'Bar']);

    expect(query.dump()).toBe('searchTerm%20foo:TheFoo%20bar:And,Bar');
  });
});
