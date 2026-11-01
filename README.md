# growthify.fr

Site vitrine de l'agence Growthify : [Astro](https://astro.build) (site statique), animations [GSAP](https://gsap.com),
hébergé sur Cloudflare Workers (fichiers statiques + un petit script pour les formulaires). Référence commune des projets Growthify : `../GROWTHIFY-COMMUN.md`.

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

Les formulaires (contact et newsletter) sont traités par le Worker Cloudflare (dossier `worker/`).
Elles vérifient la protection anti-robots (Cloudflare Turnstile) puis envoient le message par e-mail via Brevo
à management@growthify.fr.

Réglages à faire dans Cloudflare > Workers & Pages > `growthify` > **Settings** :

- **Variables and Secrets** : `BREVO_API_KEY`, `TURNSTILE_SECRET_KEY` (type Secret) et les variables optionnelles ;
- **Build > Variables and secrets** : `PUBLIC_TURNSTILE_SITE_KEY` (utilisée pendant la construction du site).


| Nom | Type | Rôle |
|---|---|---|
| `BREVO_API_KEY` | Secret | Clé API Brevo (Brevo > SMTP & API > Clés API) |
| `TURNSTILE_SECRET_KEY` | Secret | Clé secrète du widget Turnstile |
| `PUBLIC_TURNSTILE_SITE_KEY` | Texte | Clé publique du widget Turnstile (utilisée à la construction du site) |
| `BREVO_LIST_ID` | Texte (optionnel) | Numéro de la liste « Newsletter » dans Brevo |
| `CONTACT_TO` | Texte (optionnel) | Destinataire(s), séparés par des virgules ; par défaut management@growthify.fr |
| `BREVO_SENDER_EMAIL` | Texte (optionnel) | Expéditeur vérifié dans Brevo, par défaut contact@growthify.fr |

## Hébergement Cloudflare Workers

- Configuration : `wrangler.jsonc` (nom du Worker `growthify`, fichiers servis depuis `dist`, redirections dans `public/_redirects`)
- Commande de construction : `npm run build` ; commande de déploiement : `npx wrangler deploy`
- Version de Node : 24 (fichier `.node-version`)
- Tester le site complet (formulaires compris) sur son ordinateur, après `npm run build` :

```bash
cd "/Users/tarik/Claude Code Repo/Growthify Site" && npx wrangler dev
```

## À faire plus tard

- [ ] **Anti-robot Turnstile** (seulement si du spam arrive par les formulaires). Dans Cloudflare : **Turnstile** →
  **Add widget** → nom `Site Growthify`, noms d'hôte `growthify.fr`, `www.growthify.fr` et l'adresse `….workers.dev`,
  mode **Managed**. Puis, dans Workers & Pages → `growthify` → **Settings** :
  `TURNSTILE_SECRET_KEY` (Variables and Secrets, type Secret) et `PUBLIC_TURNSTILE_SITE_KEY`
  (Build → Variables and secrets), et relancer un déploiement. Aucun changement de code n'est nécessaire.
- [ ] Après la bascule de growthify.fr : désactiver l'adresse `….workers.dev` du Worker (Settings → Domains & Routes).
