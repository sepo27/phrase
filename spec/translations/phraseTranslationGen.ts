import { PhraseTranslation } from '../../src/translations/types';

type PartialTranslation = Partial<PhraseTranslation>;

const DefaultTranslation = {
  id: 'abcd1234cdef1234abcd1234cdef1234',
  content: 'My translation',
  unverified: false,
  excluded: false,
  plural_suffix: '',
  key: {
    id: 'abcd1234cdef1234abcd1234cdef1234',
    name: 'home.index.headline',
    plural: false,
  },
  locale: {
    id: 'abcd1234cdef1234abcd1234cdef1234',
    name: 'de',
    code: 'de-DE',
  },
  placeholders: [
    '%{count}',
  ],
  state: 'translated',
  created_at: '2015-01-28T09:52:53Z',
  updated_at: '2015-01-28T09:52:53Z',
};

export const phraseTranslationGen = (input: PartialTranslation = {}): PhraseTranslation => ({
  ...DefaultTranslation,
  ...input,
});

export const manyPhraseTranslationsGen = (input: PartialTranslation[]): PhraseTranslation[] =>
  input.map(phraseTranslationGen);
