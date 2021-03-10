import { PhraseBaseSearchQuery } from '../search/PhraseBaseSearchQuery';
import { PhraseDateOperator } from '../search/constants';

const Param = {
  ID: 'id',
  UNVERIFIED: 'unverified',
  TAGS: 'tags',
  EXCLUDED: 'excluded',
  UPDATED_AT: 'updated_at',
};

export class PhraseTranslationsSearchQuery extends PhraseBaseSearchQuery {
  public id(val: string[]): this {
    return this.addMultiParam(Param.ID, val);
  }

  public unverified(): this { return this.addBooleanParam(Param.UNVERIFIED, true); }

  public notUnverified(): this { return this.addBooleanParam(Param.UNVERIFIED, false); }

  public tags(val: string): this { return this.addParam(Param.TAGS, val); }

  public excluded(): this { return this.addBooleanParam(Param.EXCLUDED, true); }

  public notExcluded(): this { return this.addBooleanParam(Param.EXCLUDED, false); }

  public updatedAtGt(date: Date): this { return this.addDateParam(Param.UPDATED_AT, date, PhraseDateOperator.GT); }

  public updatedAtLt(date: Date): this { return this.addDateParam(Param.UPDATED_AT, date, PhraseDateOperator.LT); }

  public updatedAt(from: Date, to: Date): this { return this.addDateRangeParam(Param.UPDATED_AT, from, to); }
}
