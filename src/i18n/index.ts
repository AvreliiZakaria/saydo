export type Locale = 'ru' | 'en';

export const translations = {
  ru: { today: 'Сегодня', score: 'Счёт', people: 'Люди', profile: 'Профиль', sayDo: 'SAY/DO', headline: 'Сказал. Сделай.', emptyTitle: 'Пока доказывать нечего.', emptyText: 'Пообещай себе одну конкретную вещь.', say: 'СКАЗАТЬ', lock: 'ЗАФИКСИРОВАТЬ' },
  en: { today: 'Today', score: 'Score', people: 'People', profile: 'Profile', sayDo: 'SAY/DO', headline: 'Say it. Do it.', emptyTitle: 'Nothing to prove yet.', emptyText: 'Make one concrete promise to yourself.', say: 'SAY IT', lock: 'LOCK PROMISE' },
} as const;

export type Copy = (typeof translations)[Locale];
export function getCopy(locale: Locale = 'ru'): Copy { return translations[locale]; }
