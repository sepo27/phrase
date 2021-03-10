import { LooseObject } from '../../lib/types';
import { PhraseSearchQueryInterface } from './PhraseSearchQueryInterface';
import { PhraseSearchInterface } from './PhraseSearchInterface';

type DQ = PhraseSearchQueryInterface;
type Params = LooseObject;

export abstract class PhraseBaseSearch<Q extends DQ = DQ> implements PhraseSearchInterface {
  /*** Public ***/

  public dump(): Params {
    return this.params;
  }

  public query(query: Q): this {
    this.params.q = query.dump();
    return this;
  }

  /*** Protected ***/

  protected addParam(name: string, value: string) {
    this.params[name] = value;
    return this;
  }

  /*** Private ***/

  private params: Params = {};
}
