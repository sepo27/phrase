const FORM_DATA_FILENAME_PREFIX = '@file:';

export const formDataFilename = (filename: string) =>
  `${FORM_DATA_FILENAME_PREFIX}${filename}`;

export const hasFormDataFilename = (filename: string) =>
  filename.indexOf(FORM_DATA_FILENAME_PREFIX) === 0;

export const extractFormDataFilename = (filename: string) =>
  filename.replace(FORM_DATA_FILENAME_PREFIX, '');
