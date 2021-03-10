export interface PhraseTranslation {
  id: string,
  content: string,
  unverified: boolean,
  excluded: boolean,
  plural_suffix: string,
  key: {
    id: string,
    name: string,
    plural: boolean
  },
  locale: {
    id: string,
    name: string,
    code: string
  },
  placeholders: string[],
  state: string,
  created_at: string,
  updated_at: string
}
