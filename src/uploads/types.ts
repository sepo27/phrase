import { LooseObject } from '../../lib/types';

export interface PhraseUploadsOptions {
  post?: PhraseUploadsPostOptions,
}

export interface PhraseUploadsPostOptions {
  file_format?: string,
  locale_id?: string,
  tags?: string | string[],
  update_translations?: 'true' | 'false',
}

export interface PhraseUpload {
  id: string,
  filename: string,
  format: string,
  state: string,
  summary: LooseObject,
  tag: string | null,
  created_at: string,
  updated_at: string,
}
