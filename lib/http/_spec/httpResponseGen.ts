import { HttpResponse } from '../types';
import { HttpStatus, httpStatusText } from '../meta/status';

type Input = Partial<HttpResponse>;

const Default = {
  data: {},
  status: HttpStatus.OK,
  statusText: httpStatusText(HttpStatus.OK),
  headers: {},
  config: {},
};

export const httpResponseGen = (input: Input = {}): HttpResponse => ({
  ...Default,
  ...input,
});
