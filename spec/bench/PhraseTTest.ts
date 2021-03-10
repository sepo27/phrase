import { PhraseTMock } from './PhraseTMock';
import { PhraseClient } from '../../src/client/PhraseClient';

const PhraseClientDefaultConfig = {
  projectId: 'abcd-efgh',
  accessToken: 's;lkdjf;lksa;jfdljdsf',
};

export class PhraseTTest {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private mock: PhraseTMock) {}

  /*** Public ***/

  public constructPhraseClientBlock(blockName: string) {
    const
      httpClient = { request: () => null },
      blockClient = {};

    this.mock.http.$constructor.returns(httpClient);
    this.mock.phrase.uploads.$constructor;
    this.mock.phrase.keys.$constructor;
    this.mock.phrase.translations.$constructor;
    this.mock.phrase[blockName].$constructor.returns(blockClient);

    const client = new PhraseClient(PhraseClientDefaultConfig);

    expect(this.mock.phrase[blockName].$constructor.calledOnce).toBeTruthy();
    expect(this.mock.phrase[blockName].$constructor.getCall(0).args[0]).toBe(httpClient);
    expect(client[blockName]).toBe(blockClient);
  }
}
