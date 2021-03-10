import { PhraseBaseSearch } from './PhraseBaseSearch';
import { PhraseOrder, PhraseWideSort } from './constants';
import { PhraseSearchQueryInterface } from './PhraseSearchQueryInterface';

type DQ = PhraseSearchQueryInterface;

export class PhraseWideSearch<Q extends DQ = PhraseSearchQueryInterface> extends PhraseBaseSearch<Q> {
  branch(name: string): this { return this.addParam('branch', name); }

  sort(val: PhraseWideSort): this { return this.addParam('sort', val); }

  order(val: PhraseOrder): this { return this.addParam('order', val); }
}
