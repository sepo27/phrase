import * as sinonLib from 'sinon';
import axios from 'axios';
import { ModuleMock, ClassMock } from '@libj/tbench';
import * as FormDataModule from '../form/FormData';
import { HttpClient } from '../main/HttpClient';
import { HttpClientConfig } from '../types';
import { LooseObject } from '../../types';

interface HttpResult {
  http: HttpClient,
  mock: LooseObject,
}

export class HttpClientTBench {
  constructor() {
    const
      sinon = sinonLib.createSandbox(),
      axiosInstanceMock = ModuleMock({
        request() {},
      });

    this.mock = {
      sinon,
      axios: {
        main: ModuleMock(axios, sinon),
        instance: axiosInstanceMock,
      },
      fs: ModuleMock('fs-extra', sinon),
      formData: ClassMock(FormDataModule, {
        'append()': null,
        'getHeaders()': null,
      }, sinon),
      http: {
        instance: (config: HttpClientConfig = {}): HttpResult => {
          const
            http = new HttpClient(config),
            mock = ModuleMock(http);

          return { http, mock };
        },
      },
    };

    this.mock.axios.main.create.returns(axiosInstanceMock);
  }

  public mock;

  public restore() { this.mock.sinon.restore(); }
}
