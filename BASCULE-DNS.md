# Bascule de growthify.fr vers le nouveau site

Objectif : faire pointer growthify.fr et www.growthify.fr vers le Worker Cloudflare `growthify`
(aujourd'hui sur https://growthify.tarik-abas.workers.dev) **sans couper les e-mails ni Growthify OS**.

Pourquoi déplacer la zone DNS chez Cloudflare : un Worker ne peut recevoir un domaine que si la zone DNS est gérée
par Cloudflare. Le domaine reste **enregistré chez OVH** (facturation, renouvellement) ; seule la gestion des
enregistrements DNS passe chez Cloudflare (gratuit).

## État relevé le 2026-11-01 (enregistrements publics)

| Nom | Type | Valeur | Rôle | Après la bascule |
|---|---|---|---|---|
| `growthify.fr` | A | `198.202.211.1` | ancien site Webflow | remplacé par le Worker |
| `www` | CNAME | `cdn.webflow.com` | ancien site Webflow | remplacé par le Worker |
| `growthify.fr` | MX | `1 smtp.google.com` | e-mails Google Workspace | **identique** |
| `growthify.fr` | TXT | `v=spf1 include:mx.ovh.com -all` | SPF | identique (correction conseillée, voir plus bas) |
| `growthify.fr` | TXT | `google-site-verification=WMeF…` et `…=3rs9…` | vérifications Google | **identique** |
| `growthify.fr` | TXT | `brevo-code:f1ee…` | vérification Brevo | **identique** |
| `growthify.fr` | TXT | `1\|www.growthify.fr` | réglage OVH (redirection) | à supprimer |
| `brevo1._domainkey` | CNAME | `b1.growthify-fr.dkim.brevo.com` | signature Brevo | **identique** |
| `brevo2._domainkey` | CNAME | `b2.growthify-fr.dkim.brevo.com` | signature Brevo | **identique** |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | DMARC | **identique** |
| `os` | A | `192.99.247.150` | Growthify OS (VPS) | **identique**, en « DNS only » (nuage gris) |
| `ftp` | CNAME | `growthify.fr` | réglage OVH par défaut, inutilisé | peut être supprimé |
| `_webflow` | TXT | `one-time-verification=de1c…` (en double) | vérification Webflow | à supprimer après la bascule |

⚠️ **DNSSEC est activé** chez OVH. Il faut le désactiver et attendre 24 h **avant** de changer les serveurs DNS,
sinon le domaine entier (site et e-mails) devient injoignable.

Liste confirmée par l'export complet de la zone OVH (sauvegarde locale : `dns-backup/zone-ovh-growthify.fr-2026-11-01.txt`).

## Étapes

- [x] **0. Sauvegarde** (faite le 2026-11-01) : exporter la zone OVH en mode texte (OVH > Web Cloud > Noms de domaine > growthify.fr >
      Zone DNS > « Modifier en mode textuel », tout copier).
- [x] **1. Désactiver DNSSEC** chez OVH (Noms de domaine > growthify.fr > Informations générales > « Secure delegation -
      DNSSEC »), puis **attendre 24 h**. Demandé le 2026-11-01 (statut « Disabling… »). Avant l'étape 3, vérifier que
      `dig +short DS growthify.fr` ne renvoie plus rien. Vérifié le 2026-11-02 : plus d'enregistrement DS.
- [ ] **2. Ajouter growthify.fr dans Cloudflare** (offre Free). Cloudflare importe les enregistrements ; on les
      compare à la sauvegarde avant d'aller plus loin (vérification faite directement sur les serveurs Cloudflare).
- [ ] **3. Changer les serveurs DNS chez OVH** pour les 2 serveurs donnés par Cloudflare. Pendant la propagation
      (quelques heures), l'ancien site Webflow et les e-mails continuent de fonctionner.
- [ ] **4. Une fois la zone « Active »** : brancher `growthify.fr` et `www.growthify.fr` sur le Worker (Custom
      domains), rediriger `growthify.fr` vers `www.growthify.fr`, vérifier pages, redirections, formulaire et
      e-mails.
- [ ] **5. Finitions** : réactiver DNSSEC (côté Cloudflare, puis nouvel enregistrement DS chez OVH), désactiver
      l'adresse `workers.dev`, envoyer le sitemap dans Google Search Console, arrêter l'hébergement Webflow
      après une ou deux semaines.

Correction SPF conseillée (avec l'accord de Tarik, peut se faire à l'étape 4) :
`v=spf1 include:_spf.google.com include:spf.brevo.com ~all`
