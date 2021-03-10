import { PhraseBaseSearchQuery } from '../search/PhraseBaseSearchQuery';
import { PhraseDateOperator } from '../search/constants';

enum Param {
  IDS = 'ids',
  NAME = 'name',
  TAGS = 'tags',
  TRANSLATED = 'translated',
  UPDATED_AT = 'updated_at',
  UNMENTIONED_IN_UPLOAD = 'unmentioned_in_upload',
}

export class PhraseKeysSearchQuery extends PhraseBaseSearchQuery {
  ids(val: string[]): this { return this.addMultiParam(Param.IDS, val); }

  name(val: string): this { return this.addParam(Param.NAME, val); }

  tags(val: string[]): this { return this.addMultiParam(Param.TAGS, val); }

  isTranslated(): this { return this.addBooleanParam(Param.TRANSLATED, true); }

  isNotTranslated(): this { return this.addBooleanParam(Param.TRANSLATED, false); }

  updatedAtGt(date: Date): this { return this.addDateParam(Param.UPDATED_AT, date, PhraseDateOperator.GT); }

  updatedAtLt(date: Date): this { return this.addDateParam(Param.UPDATED_AT, date, PhraseDateOperator.LT); }

  updatedAt(from: Date, to: Date): this { return this.addDateRangeParam(Param.UPDATED_AT, from, to); }

  unmentionedInUpload(keys: string[]): this { return this.addMultiParam(Param.UNMENTIONED_IN_UPLOAD, keys); }
}
