import { LooseObject } from '../lib/types';

type Request<T> = (page: number, perPage: number) => Promise<T[]>;

interface Options {
  perPage?: number,
}

const DefaultOptions: Options = {
  perPage: 25,
};

export class PhrasePager<T = LooseObject> {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private request: Request<T>, private options: Options = DefaultOptions) {}

  /*** Public ***/

  public next(): Promise<T[]> {
    if (this.ended) {
      return Promise.resolve([]);
    }

    return this
      .request(this.page, this.options.perPage)
      .then(set => {
        if (set.length) {
          this.page++;
        } else {
          this.ended = true;
        }
        return set;
      });
  }

  public all(): Promise<T[]> {
    let res = [];

    const next = () => this.next().then(set => {
      if (this.ended) {
        return res;
      }
      res = res.concat(set);
      return next();
    });

    return next();
  }

  /*** Private ***/

  private page: number = 1;
  private ended: boolean = false;
}

// TODO: move out to constants
export { DefaultOptions as PhrasePagerDefaultOptions };
