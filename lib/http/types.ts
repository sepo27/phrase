import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { LooseObject, MapS } from '../types';

// TODO: should be proper type from FormData lib
type FormDataOpt = MapS<any>;

export interface HttpRequestOptions extends AxiosRequestConfig{
  form?: FormDataOpt,
}

export interface HttpClientConfig extends HttpRequestOptions {}

export type HttpHeaders = LooseObject;

export interface HttpResponse<D = LooseObject> extends AxiosResponse<D> {
  headers: HttpHeaders,
}

export type HttpSubmitArgs<D = LooseObject> = [string] | [string, D] | [string, D, HttpRequestOptions];
