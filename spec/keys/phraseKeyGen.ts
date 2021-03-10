import { PhraseKey } from '../../src/keys/types';

type PhraseKeyPartial = Partial<PhraseKey>;

const DefaultPhraseKey = {
  id: 'abcd1234cdef1234abcd1234cdef1234',
  name: 'home.index.headline',
  description: 'My description for this key...',
  name_hash: '1b31d2580ce324f246f66b3be00ed399',
  plural: false,
  tags: [
    'awesome-feature',
    'needs-proofreading',
  ],
  data_type: 'string',
  created_at: '2015-01-28T09:52:53Z',
  updated_at: '2015-01-28T09:52:53Z',
};

export const phraseKeyGen = (input: PhraseKeyPartial = {}): PhraseKey => ({
  ...DefaultPhraseKey,
  ...input,
});

export const manyPhraseKeysGen = (input: PhraseKeyPartial[] = []) =>
  input.map(phraseKeyGen);
