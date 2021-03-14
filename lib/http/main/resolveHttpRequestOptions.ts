import * as fs from 'fs-extra';
import { HttpRequestOptions } from '../types';
import { HttpConfigError } from '../error/HttpConfigError';
import { HttpMethod } from '../meta/HttpMethod';
import {
  FormData,
  hasFormDataFilename,
  extractFormDataFilename,
} from '../form';

export const resolveHttpRequestOptions = (options: HttpRequestOptions) => {
  const nextOptions = { ...options };

  if (nextOptions.form) {
    if (nextOptions.data) {
      throw new HttpConfigError('Cannot accept both data and formData in request');
    }

    const method = nextOptions.method ? nextOptions.method.toUpperCase() : '';
    if ([HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH].indexOf(method as HttpMethod) < 0) {
      throw new HttpConfigError('Form data is only allowed with POST / PUT / PATCH methods');
    }

    const form = new FormData();
    Object.keys(nextOptions.form).forEach(field => {
      let val = nextOptions.form[field];

      if (hasFormDataFilename(val)) {
        const filename = extractFormDataFilename(val);
        if (!fs.existsSync(filename)) {
          throw new HttpConfigError(`Invalid form file: ${filename}`);
        }

        val = fs.createReadStream(filename);
      }

      form.append(field, val);
    });
    nextOptions.data = form;
    nextOptions.headers = {
      ...nextOptions.headers,
      ...form.getHeaders(),
    };
  }

  return nextOptions;
};
