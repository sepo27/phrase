/* eslint-disable prefer-template */

export const PhraseUri = {
  /*** Segments ***/

  BASE: 'https://api.phrase.com/v2',
  PROJECTS: '/projects',
  UPLOADS: '/uploads',
  KEYS: '/keys',
  TRANSLATIONS: '/translations',

  /*** Getters ***/

  toProject(id: string): string {
    return this.BASE + this.PROJECTS + `/${id}`;
  },

  keyTranslations(keyId: string): string {
    return this.KEYS + `/${keyId}` + this.TRANSLATIONS;
  },
};
