const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDate = (d: Date) => dateFormat.format(d);

// Temps de lecture estimé (environ 220 mots par minute).
export const readingTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
