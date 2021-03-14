import { PhraseBaseSearchQuery } from '../search/PhraseBaseSearchQuery';

const Param = {
  VERIFIED: 'verified',
  TAGS: 'tags',
};

export class PhraseTranslationsUnverifyQuery extends PhraseBaseSearchQuery {
  term(val: string): this { return this.addTerm(val); }

  verified(): this { return this.addBooleanParam(Param.VERIFIED, true); }

  unverified(): this { return this.addBooleanParam(Param.VERIFIED, false); }

  tags(val: string[]): this { return this.addMultiParam(Param.TAGS, val); }
}
