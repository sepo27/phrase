import { PhraseTBench } from './bench/PhraseTBench';
import { PhraseUri } from '../src/PhraseUri';
import { PhraseClient } from '../src/client/PhraseClient';

const DefaultConfig = {
  projectId: 'abcd-efgh',
  accessToken: 's;lkdjf;lksa;jfdljdsf',
};

describe('PhraseClient', () => {
  let bench: PhraseTBench;

  beforeEach(() => {
    bench = new PhraseTBench();
  });

  afterEach(() => {
    bench.restore();
  });

  it('initializes http client with config', () => {
    const
      projectId = 'abcd-efgh',
      accessToken = 's;lkdjf;lksa;jfdljdsf';

    bench.mock.http.$constructor;

    new PhraseClient({
      projectId,
      accessToken,
    });

    expect(bench.mock.http.$constructor.calledOnce).toBeTruthy();
    expect(bench.mock.http.$constructor.getCall(0).args).toEqual([{
      baseURL: PhraseUri.toProject(projectId),
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }]);
  });

  it('constructs uploads with http client', () => {
    bench.test.constructPhraseClientBlock('uploads');
  });

  it('constructs uploads with options', () => {
    const uploadsOptions = {
      post: {
        file_format: 'json',
      },
    };

    bench.mock.http.$constructor;
    bench.mock.phrase.uploads.$constructor;

    new PhraseClient({
      ...DefaultConfig,
      uploads: uploadsOptions,
    });

    expect(bench.mock.phrase.uploads.$constructor.calledOnce).toBeTruthy();
    expect(bench.mock.phrase.uploads.$constructor.getCall(0).args[1]).toEqual(uploadsOptions);
  });

  it('constructs keys with http client', () => {
    bench.test.constructPhraseClientBlock('keys');
  });

  it('constructs translations with http client', () => {
    bench.test.constructPhraseClientBlock('translations');
  });
});
