import { PhraseUploadsOptions } from '../uploads/types';

export interface PhraseClientConfig {
  projectId: string,
  accessToken: string,
  uploads?: PhraseUploadsOptions,
}
