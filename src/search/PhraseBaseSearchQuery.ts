import { PhraseSearchQueryInterface } from './PhraseSearchQueryInterface';
import { PhraseDateOperator } from './constants';

const
  PARAM_SEP = '%20',
  VAL_SEP = ':',
  MULTI_SEP = ',';

export abstract class PhraseBaseSearchQuery implements PhraseSearchQueryInterface {
  /*** Public ***/

  dump(): string {
    return this.params.join(PARAM_SEP);
  }

  public get isEmpty(): boolean { return !this.params.length; }
  public get isNotEmpty(): boolean { return !this.isEmpty; }

  /*** Protected ***/

  protected addTerm(val: string): this {
    this.params.unshift(val);
    return this;
  }

  protected addParam(name: string, value: string): this {
    this.params.push(`${name}${VAL_SEP}${value}`);
    return this;
  }

  protected addMultiParam(name: string, value: string[]): this {
    return this.addParam(name, value.join(MULTI_SEP));
  }

  protected addBooleanParam(name: string, value: boolean): this {
    return this.addParam(name, value.toString());
  }

  protected addDateParam(name: string, date: Date, operator: PhraseDateOperator): this {
    const strDate = date.toISOString().replace(/\.\d+Z/, 'Z');
    return this.addParam(name, `${operator}${strDate}`);
  }

  protected addDateRangeParam(name: string, from: Date, to: Date): this {
    return this
      .addDateParam(name, from, PhraseDateOperator.GT)
      .addDateParam(name, to, PhraseDateOperator.LT);
  }

  /*** Private ***/

  private params: string[] = [];
}
