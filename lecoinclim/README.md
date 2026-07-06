# Le CoinClim — site vitrine statique

Site 100% statique (HTML/CSS/JS), sans base de données ni backend. Les commandes et
messages de contact sont transmis via WhatsApp (et bientôt e-mail, actuellement
désactivé). Bilingue français / allemand.

## Structure du projet

```
lecoinclim/
├── index.html          → page unique du site
├── css/
│   └── style.css       → toutes les feuilles de style
├── js/
│   └── main.js         → toute la logique (catalogue produits, panier, i18n, etc.)
├── images/
│   └── products/       → photos produits (.jpg) et illustrations placeholder (.svg)
├── _headers             → en-têtes de sécurité pour Netlify
├── netlify.toml          → configuration de build Netlify
├── .htaccess             → en-têtes de sécurité + HTTPS + cache pour Hostinger (Apache)
├── robots.txt
└── README.md             → ce fichier
```

Aucune étape de build n'est nécessaire : c'est un site statique classique, prêt à l'emploi.

## Déployer sur Netlify

**Option A — glisser-déposer (le plus simple) :**
1. Va sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Fais glisser le dossier `lecoinclim` entier (avec tous ses sous-dossiers) dans la zone de dépôt
3. Netlify déploie le site en quelques secondes et te donne une URL (ex. `random-name.netlify.app`)
4. Le fichier `_headers` et `netlify.toml` sont détectés automatiquement pour appliquer les en-têtes de sécurité

**Option B — via Git (recommandé pour les mises à jour futures) :**
1. Pousse ce dossier dans un dépôt GitHub/GitLab
2. Sur Netlify : "Add new site" → "Import an existing project" → connecte le dépôt
3. Build command : laisser vide. Publish directory : `.` (racine)

Pour un nom de domaine personnalisé (ex. `lecoinclim.fr`) : Site settings → Domain management → Add custom domain.

## Déployer sur Hostinger

1. Connecte-toi à hPanel → File Manager (ou via FTP/SFTP avec un client comme FileZilla)
2. Va dans le dossier `public_html` de ton domaine
3. Supprime les fichiers par défaut s'il y en a (ex. `index.html` de bienvenue)
4. Upload **tout le contenu** du dossier `lecoinclim` (pas le dossier lui-même, son contenu) directement dans `public_html` : `index.html`, `.htaccess`, `css/`, `js/`, `images/`, `robots.txt` doivent être à la racine de `public_html`
5. Le `.htaccess` force automatiquement HTTPS et applique les en-têtes de sécurité — vérifie que le module `mod_headers` et `mod_rewrite` sont actifs (activés par défaut chez Hostinger)
6. Le SSL gratuit (Let's Encrypt) s'active depuis hPanel → SSL si ce n'est pas déjà fait

**Important :** si tu utilises un sous-dossier plutôt que la racine du domaine, tous les chemins relatifs (`css/style.css`, `images/products/...`) continueront de fonctionner tant que la structure de dossiers est respectée telle quelle.

## Sécurité mise en place

- **CSP stricte** : le JavaScript est 100% externe (aucun script inline), donc `script-src 'self'` sans `unsafe-inline`
- **X-Frame-Options: DENY** et `frame-ancestors 'none'` — empêche le site d'être affiché dans une iframe (anti-clickjacking)
- **HSTS** — force HTTPS pendant 2 ans une fois activé
- **Referrer-Policy: no-referrer** — aucune fuite d'URL vers des sites tiers (WhatsApp, Gmail)
- **Permissions-Policy** — désactive caméra, micro, géolocalisation, paiement (non utilisés par le site)
- **Aucune donnée bancaire** n'est collectée ni stockée par le site : le règlement se fait uniquement par virement bancaire, en dehors du site
- Champs "honeypot" invisibles sur les formulaires (commande et contact) pour limiter les soumissions automatisées basiques

## Ce qu'il reste à compléter avant une mise en ligne commerciale réelle

Ces points sont volontairement laissés en placeholder dans le code et doivent être
remplacés avec les vraies informations de l'entreprise :

1. **Mentions légales** (footer → "Mentions légales") : dénomination sociale, forme
   juridique, SIRET, adresse de siège ou de domiciliation, nom du directeur de
   publication, hébergeur.
2. **Photos manquantes** : De'Longhi Pinguino Compact ES72 Young et Olimpia Splendid
   Dolceclima Silent 10 utilisent encore une illustration générique "Photo à venir" —
   à remplacer par de vraies photos (fournies par toi ou achetées/licenciées
   légalement) dans `images/products/`, puis mettre à jour le tableau `images` du
   produit correspondant dans `js/main.js`.
3. **Canal e-mail** : actuellement désactivé (message "temporairement indisponible")
   dans `js/main.js`, recherche `EMAIL_UNAVAILABLE` / `gmailConfirmLink` /
   `gmailContactLink` pour le réactiver quand une vraie boîte e-mail sera prête.
4. **Nom de domaine et SSL** à configurer selon l'hébergeur choisi (voir sections
   ci-dessus).
