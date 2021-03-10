import { PhraseTBench } from '../bench/PhraseTBench';
import { HttpForm } from '../../lib/http/form/HttpForm';
import { formDataFilename } from '../../lib/http/form';
import { PhraseUri } from '../../src/PhraseUri';
import { PhraseUploadsClient } from '../../src/uploads/PhraseUploadsClient';
import { PhraseUploadsFileData } from '../../src/uploads/PhraseUploadsFileData';
import { httpResponseGen } from '../../lib/http/_spec/httpResponseGen';

describe('PhraseUploadsClient', () => {
  let bench: PhraseTBench;

  beforeEach(() => {
    bench = new PhraseTBench();
    bench.mock.http.post.resolves(httpResponseGen());
  });

  afterEach(() => {
    bench.restore();
  });

  it('post() with filename', () => {
    const filename = '/foo/bar.json';

    new PhraseUploadsClient(bench.mock.http).post(filename);

    expect(bench.mock.http.post.calledOnce).toBeTruthy();
    expect(bench.mock.http.post.getCall(0).args).toEqual([
      PhraseUri.UPLOADS,
      new HttpForm({ file: formDataFilename(filename) }),
    ]);
  });

  it('post() with data', () => {
    bench.mock.sinon.useFakeTimers();

    const
      data = {
        foo: 'bar bar',
      },
      filename = PhraseUploadsFileData.filename(data);

    bench.mock.fs.existsSync.withArgs(PhraseUploadsFileData.DIR).returns(true);
    bench.mock.fs.writeJsonSync;

    uploads().post(data);

    expect(bench.mock.fs.writeJsonSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.writeJsonSync.getCall(0).args).toEqual([
      filename,
      data,
    ]);
    expect(bench.mock.http.post.calledOnce).toBeTruthy();
    expect(bench.mock.http.post.getCall(0).args).toEqual([
      PhraseUri.UPLOADS,
      new HttpForm({ file: formDataFilename(filename) }),
    ]);
  });

  it('post() with data creates phrase tmp dir if does not exist', () => {
    bench.mock.fs.existsSync.withArgs(PhraseUploadsFileData.DIR).returns(false);
    bench.mock.fs.mkdirSync;
    bench.mock.fs.writeJsonSync;

    uploads().post({});

    expect(bench.mock.fs.mkdirSync.calledOnce).toBeTruthy();
    expect(bench.mock.fs.mkdirSync.getCall(0).args).toEqual([
      PhraseUploadsFileData.DIR,
    ]);
  });

  it('post() with default options', () => {
    const defaultOptions = {
      file_format: 'react_simple_json',
    };

    uploads({ post: defaultOptions }).post('');

    expect(bench.mock.http.post.calledOnce).toBeTruthy();
    expect(bench.mock.http.post.getCall(0).args[1]).toMatchObject(new HttpForm(defaultOptions));
  });

  it('post() with options', () => {
    const options = {
      locale_id: 'en',
    };

    uploads().post('', options);

    expect(bench.mock.http.post.calledOnce).toBeTruthy();
    expect(bench.mock.http.post.getCall(0).args[1]).toMatchObject(new HttpForm(options));
  });

  it('post() overwrite options over default options', () => {
    const
      defaultOptions = {
        file_format: 'json',
        locale_id: 'en',
      },
      options = {
        locale_id: 'da',
      };

    uploads({ post: defaultOptions }).post('', options);

    expect(bench.mock.http.post.calledOnce).toBeTruthy();
    expect(bench.mock.http.post.getCall(0).args[1]).toMatchObject(new HttpForm({
      ...defaultOptions,
      ...options,
    }));
  });

  it('post() with one tag', () => {
    const tags = 'foo';

    new PhraseUploadsClient(bench.mock.http).post('', { tags });

    expect(bench.mock.http.post.calledOnce).toBeTruthy();
    expect(bench.mock.http.post.getCall(0).args[1]).toMatchObject(new HttpForm({
      tags,
    }));
  });

  it('post() with many tags', () => {
    const tags = ['foo', 'bar'];

    uploads().post('', { tags });

    expect(bench.mock.http.post.calledOnce).toBeTruthy();
    expect(bench.mock.http.post.getCall(0).args[1]).toMatchObject(new HttpForm({
      tags: tags.join(','),
    }));
  });

  it('post() resolves with response', () => {
    const res = httpResponseGen({
      data: { foo: 'bar' },
    });

    bench.mock.http.post.resolves(res);

    return expect(uploads().post('')).resolves.toMatchObject(res.data);
  });

  /*** Lib ***/

  function uploads(options = {}) {
    return new PhraseUploadsClient(bench.mock.http, options);
  }
});
