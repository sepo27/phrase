export class PhraseTranslationsKeyRef {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private ref: string) {}

  public static readonly NAME_PREFIX: string = 'name:';

  public static makeNameRef(name: string): string {
    return `${PhraseTranslationsKeyRef.NAME_PREFIX}${name}`;
  }

  public get isId(): boolean {
    return this.ref.indexOf(PhraseTranslationsKeyRef.NAME_PREFIX) < 0;
  }

  public get id(): string {
    if (this.isId) {
      return this.ref;
    }
    throw new Error('Cannot return key id, since key ref is not id');
  }

  public get isName(): boolean {
    return this.ref.indexOf(PhraseTranslationsKeyRef.NAME_PREFIX) === 0;
  }

  public get name(): string {
    if (this.isName) {
      return this.ref.replace(PhraseTranslationsKeyRef.NAME_PREFIX, '');
    }
    throw new Error('Cannot return key name, key ref is not name');
  }
}
