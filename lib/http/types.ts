import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { LooseObject, MapS } from '../types';

type FormDataOpt = MapS<string>;

export interface HttpRequestOptions extends AxiosRequestConfig{
  form?: FormDataOpt,
}

export interface HttpClientConfig extends HttpRequestOptions {}

export type HttpHeaders = LooseObject;

export interface HttpResponse<D = LooseObject> extends AxiosResponse<D> {
  headers: HttpHeaders,
}

export type HttpSubmitArgs<D = LooseObject> = [string] | [string, D] | [string, D, HttpRequestOptions];
