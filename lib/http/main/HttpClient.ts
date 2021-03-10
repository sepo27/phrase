import axios, { AxiosInstance } from 'axios';
import { HttpClientConfig, HttpRequestOptions, HttpResponse, HttpSubmitArgs } from '../types';
import { LooseObject } from '../../types';
import { HttpMethod } from '../meta/HttpMethod';
import { HttpResponseError } from '../error/HttpResponseError';
import { resolveHttpRequestOptions } from './resolveHttpRequestOptions';
import { HttpForm } from '../form/HttpForm';

export class HttpClient {
  constructor(config: HttpClientConfig = {}) {
    this.agent = axios.create(config);
  }

  /*** Public ***/

  public request<D = LooseObject>(
    url: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<D>> {
    return this.agent
      .request({ ...resolveHttpRequestOptions(options), url })
      .catch(err => {
        if (err.response) {
          const { status, data, headers } = err.response as HttpResponse;
          throw new HttpResponseError(status, { data, headers });
        }
        throw err;
      });
  }

  public get<D = LooseObject>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<D>> {
    return this.request<D>(url, {
      ...options,
      method: HttpMethod.GET,
    });
  }

  public post<D = LooseObject>(...args: HttpSubmitArgs): Promise<HttpResponse<D>> {
    const { url, options } = this.extractSubmitArgs(args);
    // const { url, data, options } = this.extractSubmitArgs(args);

    return this.request(url, {
      ...options,
      // data,
      method: HttpMethod.POST,
    });
  }

  /*** Private ***/

  private agent: AxiosInstance;

  private extractSubmitArgs(args: HttpSubmitArgs) {
    const
      [url, data = {}, inOptions = {}] = args,
      options = { ...inOptions };

    if (data instanceof HttpForm) {
      options.form = data.data;
      delete options.data;
    } else {
      options.data = data;
    }

    return { url, options };
  }
}
