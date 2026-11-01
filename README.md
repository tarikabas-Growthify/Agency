# growthify.fr

Site vitrine de l'agence Growthify : [Astro](https://astro.build) (site statique), animations [GSAP](https://gsap.com),
hébergé sur Cloudflare Pages. Référence commune des projets Growthify : `../GROWTHIFY-COMMUN.md`.

## Modifier le contenu

| Je veux modifier… | Fichier |
|---|---|
| Un article de blog (ou en ajouter un) | `src/content/blog/*.md` |
| Un projet du portfolio | `src/content/projects/*.md` |
| Une page service | `src/content/services/*.md` |
| Téléphone, e-mail, chiffres clés, témoignages, équipe, FAQ, logos clients | `src/data/site.ts` |
| Les pages (mise en page) | `src/pages/` |
| Les couleurs et polices | `src/styles/global.css` (section « Identité Growthify ») |
| Les redirections 301 | `public/_redirects` |

Pour ajouter un article : copier un fichier de `src/content/blog/`, changer le nom du fichier (il devient l'adresse
`/blog-post/nom-du-fichier`), le titre, la description, la date et l'image de couverture (dans `src/assets/images/blog/`).

Chaque envoi sur la branche `main` de GitHub met le site à jour automatiquement en 1 à 2 minutes.

## Voir le site sur son ordinateur

```bash
cd "/Users/tarik/Claude Code Repo/Growthify Site" && npm install
```

```bash
cd "/Users/tarik/Claude Code Repo/Growthify Site" && npm run dev
```

Puis ouvrir http://localhost:4321.

## Formulaires

Les formulaires (contact et newsletter) sont traités par deux petites fonctions Cloudflare (`functions/api/`).
Elles vérifient la protection anti-robots (Cloudflare Turnstile) puis envoient le message par e-mail via Brevo
à tarik.abas@growthify.fr.

Réglages à faire dans Cloudflare Pages > projet > **Settings > Variables and Secrets** :

| Nom | Type | Rôle |
|---|---|---|
| `BREVO_API_KEY` | Secret | Clé API Brevo (Brevo > SMTP & API > Clés API) |
| `TURNSTILE_SECRET_KEY` | Secret | Clé secrète du widget Turnstile |
| `PUBLIC_TURNSTILE_SITE_KEY` | Texte | Clé publique du widget Turnstile (utilisée à la construction du site) |
| `BREVO_LIST_ID` | Texte (optionnel) | Numéro de la liste « Newsletter » dans Brevo |
| `CONTACT_TO` | Texte (optionnel) | Destinataire, par défaut tarik.abas@growthify.fr |
| `BREVO_SENDER_EMAIL` | Texte (optionnel) | Expéditeur vérifié dans Brevo, par défaut contact@growthify.fr |

## Hébergement Cloudflare Pages

- Commande de construction : `npm run build`
- Dossier publié : `dist`
- Version de Node : 22 ou plus (variable `NODE_VERSION=22`)
