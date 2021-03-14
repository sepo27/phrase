import { isStr } from '../../isType';

const FORM_DATA_FILENAME_PREFIX = '@file:';

export const formDataFilename = (filename: string) =>
  `${FORM_DATA_FILENAME_PREFIX}${filename}`;

export const hasFormDataFilename = (val: string) =>
  isStr(val) && val.indexOf(FORM_DATA_FILENAME_PREFIX) === 0;

export const extractFormDataFilename = (filename: string) =>
  filename.replace(FORM_DATA_FILENAME_PREFIX, '');
