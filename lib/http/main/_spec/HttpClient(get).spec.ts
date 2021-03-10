import { HttpMethod } from '../../meta/HttpMethod';
import { httpResponseGen } from '../../_spec/httpResponseGen';
import { HttpClientTBench } from '../../_spec/HttpClientTBench';
import { HttpStatus } from '../../meta/status';

describe('HttpClient', () => {
  let bench: HttpClientTBench;

  beforeEach(() => {
    bench = new HttpClientTBench();
  });

  afterEach(() => {
    bench.restore();
  });

  it('get() with url', () => {
    const url = '/foo';

    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.get(url);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[0]).toBe(url);
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      method: HttpMethod.GET,
    });
  });

  it('get() with options', () => {
    const options = {
      headers: { foo: 'bar' },
    };

    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.get('', options);

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject(options);
  });

  it('get() does not overwrite method', () => {
    const { http, mock } = bench.mock.http.instance();
    mock.request;

    http.get('', {
      method: HttpMethod.POST,
    });

    expect(mock.request.calledOnce).toBeTruthy();
    expect(mock.request.getCall(0).args[1]).toMatchObject({
      method: HttpMethod.GET,
    });
  });

  it('get() resolves with response', () => {
    const res = httpResponseGen({
      status: HttpStatus.BAD_REQUEST,
    });

    const { http, mock } = bench.mock.http.instance();
    mock.request.resolves(res);

    expect(http.get('')).resolves.toMatchObject({
      status: res.status,
    });
  });
});
