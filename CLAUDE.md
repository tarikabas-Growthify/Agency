# Site growthify.fr — refonte du site vitrine de l'agence Growthify

**Avant tout : lire `../GROWTHIFY-COMMUN.md`.** C'est la référence partagée entre ce site et
Growthify OS (domaine, DNS, emails, hébergement, dépôts GitHub, identité visuelle).

## Règles

- Tarik n'est pas développeur : expliquer simplement, et toujours préfixer les commandes à lancer
  d'un `cd "/Users/tarik/Claude Code Repo/Growthify Site"`.
- Ne jamais toucher à Growthify OS (`../Email Data From Companies`) ni à Firefits.
- Le site est la référence de la marque : toute évolution des couleurs, polices ou du logo est
  reportée dans la section « Identité visuelle » de `../GROWTHIFY-COMMUN.md`.
- Tout changement de DNS, de sous-domaine ou d'hébergement est noté dans `../GROWTHIFY-COMMUN.md`.
- `os.growthify.fr` est réservé à Growthify OS. Le site peut avoir un lien discret « Connexion » vers
  https://os.growthify.fr.
- La bascule DNS de growthify.fr se fait avec Tarik, étape par étape. Les e-mails sont chez Google Workspace
  (zone DNS chez OVH) : tous les enregistrements mail (MX, SPF, DKIM, DMARC, vérifications Google et Brevo)
  et l'enregistrement `os` sont recopiés à l'identique.
- Les anciennes URLs du site Webflow sont conservées ou redirigées en 301.

## Projet

- Code versionné sur GitHub : `tarikabas-Growthify/Agency`.
- Hébergement : Cloudflare Workers (Worker `growthify`, `wrangler.jsonc`), déploiement automatique depuis GitHub.
- Animations : GSAP.
- Les formulaires envoient les messages à management@growthify.fr via l'API transactionnelle de Brevo.
