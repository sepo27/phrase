import { HttpClient } from '../HttpClient';
import { HttpMethod } from '../../meta/HttpMethod';
import { httpResponseGen } from '../../_spec/httpResponseGen';
import { HttpClientTBench } from '../../_spec/HttpClientTBench';
import { HttpStatus } from '../../meta/status';
import { HttpResponseError } from '../../error/HttpResponseError';
import { HttpConfigError } from '../../error/HttpConfigError';
import { formDataFilename } from '../../form/formDataFilename';

describe('HttpClient', () => {
  let bench: HttpClientTBench;

  beforeEach(() => {
    bench = new HttpClientTBench();
    bench.mock.axios.instance.request.resolves(httpResponseGen());
  });

  afterEach(() => {
    bench.restore();
  });

  it('constructs with config', () => {
    const config = {
      baseURL: 'https://some-domain.com/api/',
    };

    new HttpClient(config);

    expect(bench.mock.axios.main.create.calledOnce).toBeTruthy();
    expect(bench.mock.axios.main.create.getCall(0).args).toEqual([config]);
  });

  it('request() with url', () => {
    const url = 'https://foo.bar';

    new HttpClient().request(url);

    expect(bench.mock.axios.instance.request.calledOnce).toBeTruthy();
    expect(bench.mock.axios.instance.request.getCall(0).args).toEqual([{ url }]);
  });

  it('request() with options', () => {
    const options = {
      method: HttpMethod.POST,
    };

    new HttpClient().request('https://dummy.com', options);

    expect(bench.mock.axios.instance.request.calledOnce).toBeTruthy();
    expect(bench.mock.axios.instance.request.getCall(0).args[0]).toMatchObject(options);
  });

  it('request() resolves with response', () => {
    const res = httpResponseGen({
      data: { foo: 'bar' },
    });

    bench.mock.axios.instance.request.resolves(res);

    const http = new HttpClient();

    expect(http.request('')).resolves.toMatchObject({
      data: res.data,
    });
  });

  it('request() throws custom https error on response error', () => {
    const response = httpResponseGen({
      status: HttpStatus.BAD_REQUEST,
    });

    const err = new Error();
    // @ts-ignore
    err.response = response;

    bench.mock.axios.instance.request.rejects(err);

    const http = new HttpClient();

    return expect(http.request(''))
      .rejects
      .toMatchObject(new HttpResponseError(HttpStatus.BAD_REQUEST, { data: response.data, headers: response.headers }));
  });

  it('request() with form', () => {
    const formHeaders = { barHeader: 'bazzzzz' };

    bench.mock.formData.append;
    bench.mock.formData.getHeaders.returns(formHeaders);

    new HttpClient().request('', {
      method: HttpMethod.POST,
      form: {
        foo: 'bar',
      },
    });

    expect(bench.mock.formData.append.calledOnce).toBeTruthy();
    expect(bench.mock.formData.append.getCall(0).args).toEqual(['foo', 'bar']);
    expect(bench.mock.axios.instance.request.calledOnce).toBeTruthy();
    expect(bench.mock.axios.instance.request.getCall(0).args[0]).toMatchObject({
      data: {},
      headers: formHeaders,
    });
  });

  it('request() with form overwrites headers', () => {
    const
      headers = {
        'Content-Type': 'foo',
        Foxy: 'Lady',
      },
      formHeaders = { 'Content-Type': 'bar' };

    bench.mock.formData.append;
    bench.mock.formData.getHeaders.returns(formHeaders);

    new HttpClient().request('', {
      method: HttpMethod.POST,
      headers,
      form: {
        bar: 'baz',
      },
    });

    expect(bench.mock.axios.instance.request.calledOnce).toBeTruthy();
    expect(bench.mock.axios.instance.request.getCall(0).args[0]).toMatchObject({
      headers: {
        ...headers,
        ...formHeaders,
      },
    });
  });

  it('request() errors out when trying to pass form along with data', () => {
    expect(
      () => new HttpClient().request('', {
        data: {},
        form: {},
      }),
    ).toThrow(new HttpConfigError('Cannot accept both data and formData in request'));
  });

  it('request() errors out when trying form with methods othern than POST / PUT', () => {
    expect(
      () => new HttpClient().request('', {
        method: HttpMethod.GET,
        form: {},
      }),
    ).toThrow(new HttpConfigError('Form data is only allowed with POST / PUT methods'));
  });

  it('request() with file in form', () => {
    const
      filename = '/foo/bar.json',
      stream = 'test stream';

    bench.mock.fs.existsSync.withArgs(filename).returns(true);
    bench.mock.fs.createReadStream.returns(stream);
    bench.mock.formData.append;
    bench.mock.formData.getHeaders;

    new HttpClient().request('', {
      method: HttpMethod.POST,
      form: {
        file: formDataFilename(filename),
      },
    });

    expect(bench.mock.fs.createReadStream.calledOnce).toBeTruthy();
    expect(bench.mock.fs.createReadStream.getCall(0).args).toEqual([filename]);
    expect(bench.mock.formData.append.calledOnce).toBeTruthy();
    expect(bench.mock.formData.append.getCall(0).args).toEqual([
      'file',
      stream,
    ]);
  });

  it('request() with file in form and some other params', () => {
    const filename = '/foo.json';

    bench.mock.fs.existsSync.withArgs(filename).returns(true);
    bench.mock.fs.createReadStream;
    bench.mock.formData.append;
    bench.mock.formData.getHeaders;

    expect(
      () => new HttpClient().request('', {
        method: HttpMethod.POST,
        form: {
          file: formDataFilename(filename),
          foo: false,
        },
      }),
    ).not.toThrow();
  });

  it('request() errors out for invalid file in form', () => {
    const filename = '/dummy.json';

    bench.mock.fs.existsSync.withArgs(filename).returns(false);

    expect(
      () => new HttpClient().request('', {
        method: HttpMethod.POST,
        form: {
          file: formDataFilename(filename),
        },
      }),
    ).toThrow(new HttpConfigError(`Invalid form file: ${filename}`));
  });
});
