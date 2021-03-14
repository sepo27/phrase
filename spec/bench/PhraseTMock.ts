import * as sinonLib from 'sinon';
import { ModuleMock, ClassMock } from '@libj/tbench';
import * as HttpClientModule from '../../lib/http/main/HttpClient';
import * as PhraseUploadsClientModule from '../../src/uploads/PhraseUploadsClient';
import * as PhraseKeysClientModule from '../../src/keys/PhraseKeysClient';
import * as PhraseTranslationsClientModule from '../../src/translations/PhraseTranslationsClient';
import * as PhrasePagerModule from '../../src/PhrasePager';

export class PhraseTMock {
  constructor() {
    this.sinon = sinonLib.createSandbox();
    this.fs = ModuleMock('fs-extra', this.sinon);
    this.http = ClassMock(HttpClientModule, {
      'get()': null,
      'post()': null,
    }, this.sinon);
    this.phrase = {
      pager: ClassMock(PhrasePagerModule, this.sinon),
      uploads: ClassMock(PhraseUploadsClientModule, this.sinon),
      keys: ClassMock(PhraseKeysClientModule, {
        'list()': null,
      }, this.sinon),
      translations: ClassMock(PhraseTranslationsClientModule, this.sinon),
    };
  }

  /*** Public ***/

  public readonly sinon: sinonLib.SinonSandbox;
  public readonly fs;
  public readonly http;
  public readonly phrase;

  public restore() { this.sinon.restore(); }
}
