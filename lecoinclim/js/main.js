"use strict";

/* ===================== CONFIGURATION ===================== */
// Site 100% statique : aucun backend requis. Le catalogue est embarqué
// directement ci-dessous et chaque commande se termine par une redirection
// vers WhatsApp pour finaliser les modalités de paiement avec le vendeur.
const WHATSAPP_NUMBER = "4917616021496"; // +49 176 16021496, format international sans "+"
const CONTACT_EMAIL_FALLBACK = "contact@lecoinclim.fr";

/* ===================== STATE ===================== */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("coinclim_cart") || "[]"); } catch(e){ cart = []; }

let LANG = "fr";
try { LANG = localStorage.getItem("coinclim_lang") || "fr"; } catch(e){ LANG = "fr"; }

/* ===================== TRADUCTIONS (FR / DE) ===================== */
const I18N = {
  fr: {
    ann1: "Déstockage été 2026 — jusqu'à <b>-43%</b> sur une sélection",
    ann2: "Livraison <b>35€</b> partout en France",
    ann3: "<b>Installation gratuite</b> à domicile",
    ann4: "Paiement 100% sécurisé par <b>virement bancaire</b>",
    skipLink: "Aller au contenu principal",
    navProduits: "Produits",
    navLivraison: "Livraison & installation",
    navAvis: "Avis clients",
    navFaq: "Questions fréquentes",
    navContact: "Contact",
    heroEyebrow: "Climatisation & confort thermique",
    heroTitle: "Votre intérieur mérite<br>son <span class=\"accent\">propre climat</span>.",
    heroLede: "Climatiseurs mobiles, split et multi-split sélectionnés pour leur efficacité. Livrés en 48/72h, installés gratuitement à domicile, réglés en toute simplicité par virement bancaire.",
    heroCta1: "Voir les climatiseurs",
    heroCta2: "Comment ça marche",
    trust1: "Installation gratuite",
    trust2: "Livraison 35€",
    trust3: "Virement sécurisé",
    heroDisplayLabel: "CoinClim // Unité active",
    heroCaption: "Température extérieure",
    heroFootMode: "Mode",
    heroFootDelivery: "Livraison",
    heroFootWarranty: "Garantie",
    band1h: "Installation gratuite", band1p: "Par un professionnel, directement chez vous.",
    band2h: "Livraison à 35€", band2p: "Partout en France, sous 48 à 72h ouvrées.",
    band3h: "Virement bancaire", band3p: "Paiement simple, sans saisie de carte en ligne.",
    band4h: "Garantie 2 ans", band4p: "Pièces et main d'œuvre sur tous les modèles.",
    prodEyebrow: "Notre sélection",
    prodTitle: "Des climatiseurs sélectionnés pour vous rafraîchir",
    prodSubtitle: "Du monobloc mobile au multi-split connecté, chaque appareil est choisi pour son efficacité réelle et sa fiabilité — pas pour son prix affiché.",
    viewProduct: "Voir le produit",
    addToCart: "Ajouter",
    unavailable: "Indisponible",
    addToCartFull: "Ajouter au panier",
    decrease: "Diminuer",
    increase: "Augmenter",
    decreaseQty: "Diminuer la quantité",
    increaseQty: "Augmenter la quantité",
    remove: "Retirer",
    addedToCart: "ajouté au panier",
    howEyebrow: "Livraison & installation",
    howTitle: "De la commande à l'air frais, en 4 étapes",
    howSubtitle: "Un parcours pensé pour être simple, sans mauvaise surprise et sans engagement caché.",
    step1h: "Choisissez votre modèle", step1p: "Ajoutez au panier le climatiseur adapté à la surface de votre pièce.",
    step2h: "Réglez par virement", step2p: "À la commande, vous recevez un RIB et une référence unique à indiquer.",
    step3h: "Livraison sous 48-72h", step3p: "Partout en France métropolitaine pour un forfait unique de 35€.",
    step4h: "Installation gratuite", step4p: "Un professionnel installe votre appareil directement chez vous, sans frais.",
    dzEyebrow: "Zone de livraison",
    dzTitle: "Livrés partout en France métropolitaine",
    dzText: "Notre réseau de transporteurs couvre l'ensemble du territoire, des grandes métropoles aux villes moyennes : Paris, Lyon, Marseille, Toulouse, Bordeaux, Nantes, Lille, Strasbourg et bien d'autres. Le forfait de livraison reste unique quelle que soit votre région.",
    dzLi1: "Livraison en 48-72h ouvrées après confirmation du virement",
    dzLi2: "Installation gratuite par un professionnel, partout en métropole",
    dzLi3: "Le créneau de livraison souhaité (matin, après-midi, soirée) est pris en compte",
    dzMapFrance: "FRANCE",
    dzMapLegend: "Zone de livraison actuelle : France métropolitaine",
    reviewsEyebrow: "Avis clients",
    reviewsTitle: "Ce que nos clients en pensent",
    reviewsMeta: "Basé sur 214 avis vérifiés",
    verifiedPurchase: "Achat vérifié",
    faqEyebrow: "Questions fréquentes",
    faqTitle: "Tout ce qu'il faut savoir avant de commander",
    ctaTitle: "Une question avant de commander ?",
    ctaText: "Notre équipe vous répond rapidement sur WhatsApp, sans blabla commercial.",
    ctaBtn: "Nous écrire",
    footerDesc: "Climatiseurs sélectionnés, livrés et installés gratuitement chez les particuliers en France. Paiement exclusivement par virement bancaire.",
    footerBadge1: "Site sans traceur publicitaire",
    footerBadge2: "Données conservées au minimum",
    footerColShop: "Boutique",
    footerLink1: "Tous les climatiseurs",
    footerColInfo: "Informations",
    footerCgv: "Conditions générales de vente",
    footerRetours: "Retours & garantie",
    footerConfidentialite: "Confidentialité",
    footerMentions: "Mentions légales",
    footerColContact: "Contact",
    footerContactNote: "Commandes traitées via WhatsApp",
    cNamePh: "Votre nom", cEmailPh: "Votre e-mail", cMsgPh: "Votre message",
    cSubmit: "Préparer mon message",
    waFastReply: "Réponse rapide",
    emailUnavailableShort: "Temporairement indisponible",
    legalNote: "<b>Mentions légales — à compléter avant mise en ligne :</b> conformément à la loi française (LCEN), ce site doit afficher la dénomination de l'entreprise, sa forme juridique, son adresse de siège social ou de domiciliation, son numéro SIRET et le nom du directeur de la publication. Ces informations sont indépendantes de la question de vie privée : une adresse de domiciliation commerciale peut être utilisée à la place d'une adresse personnelle. Remplacez les champs \"Mentions légales\" dans le code avant toute mise en ligne réelle.",
    footerCopyright: "© 2026 Le CoinClim. Tous droits réservés.",
    footerNoCookies: "Site conçu sans cookies publicitaires ni traceurs tiers.",
    cartTitle: "Votre panier",
    drawerTitleCheckout: "Vos coordonnées",
    drawerTitleThanks: "Merci !",
    cartEmpty: "Votre panier est vide.<br>Ajoutez un climatiseur pour commencer.",
    checkoutIntro: "Indiquez vos coordonnées complètes : plus elles sont précises, plus la livraison et l'installation seront simples pour le transporteur.",
    checkoutGroupContact: "Vos coordonnées",
    checkoutNamePh: "Nom et prénom",
    checkoutEmailPh: "Votre e-mail",
    checkoutPhonePh: "Téléphone (le livreur vous appelle avant de passer)",
    checkoutGroupAddress: "Adresse de livraison",
    checkoutAddressPh: "Numéro et nom de rue",
    checkoutAddress2Ph: "Complément (bâtiment, étage, appartement)",
    checkoutPostalPh: "Code postal",
    checkoutCityPh: "Ville",
    countryFrance: "France (métropolitaine)",
    countryBelgique: "Belgique",
    countrySuisse: "Suisse",
    countryLuxembourg: "Luxembourg",
    countryAutre: "Autre pays européen",
    checkoutGroupFacilitate: "Faciliter la livraison",
    slotAny: "Créneau indifférent",
    slotMorning: "Matin (8h–12h)",
    slotAfternoon: "Après-midi (12h–18h)",
    slotEvening: "Soirée (18h–20h)",
    checkoutNotesPh: "Accès : digicode, étage, ascenseur, place de parking, consignes particulières… (optionnel)",
    checkoutTotalLabel: "Total de la commande",
    checkoutSubmit: "Valider ma commande",
    backToCart: "Retour au panier",
    confirmTitle: "Commande enregistrée",
    confirmText: "Votre récapitulatif est prêt. Choisissez comment contacter notre service client pour confirmer votre commande et recevoir le RIB.",
    waDirectExchange: "Réponse rapide, échange direct",
    confirmFooterNote: "Pour toute commande, merci de passer par <b style=\"color:var(--ink);\">WhatsApp au +49 176 16021496</b> : notre messagerie e-mail est temporairement surchargée.",
    close: "Fermer",
    subtotal: "Sous-total",
    delivery: "Livraison",
    total: "Total",
    orderBtn: "Commander",
    emailUnavailableMsg: "En raison d'un grand nombre de messages, la messagerie par e-mail est temporairement indisponible. Nos équipes se battent pour y remédier. Merci de nous contacter via WhatsApp pour toute commande.",
    checkoutValidationMsg: "Merci de compléter tous les champs obligatoires (nom, e-mail valide, téléphone, adresse, code postal, ville).",
    contactMsgReady: "Message prêt — envoyez-le via WhatsApp.",
    contactValidationMsg: "Merci de compléter tous les champs avec un e-mail valide.",
    stockOutOfStock: "Rupture de stock",
    stockInStockPrefix: "en stock",
    photoComingSoon: "PHOTO À VENIR"
  },
  de: {
    ann1: "Sommer-Ausverkauf 2026 — bis zu <b>-43%</b> auf eine Auswahl",
    ann2: "Lieferung für <b>35€</b> in ganz Frankreich",
    ann3: "<b>Kostenlose Installation</b> bei Ihnen zu Hause",
    ann4: "100% sichere Zahlung per <b>Banküberweisung</b>",
    skipLink: "Zum Hauptinhalt springen",
    navProduits: "Produkte",
    navLivraison: "Lieferung & Installation",
    navAvis: "Kundenbewertungen",
    navFaq: "Häufige Fragen",
    navContact: "Kontakt",
    heroEyebrow: "Klimatisierung & Wohnkomfort",
    heroTitle: "Ihr Zuhause verdient<br>sein <span class=\"accent\">eigenes Klima</span>.",
    heroLede: "Mobile Klimageräte, Split- und Multi-Split-Systeme, ausgewählt nach ihrer Effizienz. Lieferung in 48/72h, kostenlose Installation bei Ihnen zu Hause, unkomplizierte Zahlung per Banküberweisung.",
    heroCta1: "Klimageräte ansehen",
    heroCta2: "So funktioniert's",
    trust1: "Kostenlose Installation",
    trust2: "Lieferung 35€",
    trust3: "Sichere Überweisung",
    heroDisplayLabel: "CoinClim // Gerät aktiv",
    heroCaption: "Außentemperatur",
    heroFootMode: "Modus",
    heroFootDelivery: "Lieferung",
    heroFootWarranty: "Garantie",
    band1h: "Kostenlose Installation", band1p: "Durch einen Fachmann, direkt bei Ihnen zu Hause.",
    band2h: "Lieferung für 35€", band2p: "In ganz Frankreich, innerhalb von 48 bis 72 Werktagsstunden.",
    band3h: "Banküberweisung", band3p: "Einfache Zahlung, ohne Eingabe von Kartendaten online.",
    band4h: "2 Jahre Garantie", band4p: "Teile und Arbeitszeit bei allen Modellen inbegriffen.",
    prodEyebrow: "Unsere Auswahl",
    prodTitle: "Klimageräte, ausgewählt, um Sie abzukühlen",
    prodSubtitle: "Vom mobilen Monoblock bis zum vernetzten Multi-Split-System — jedes Gerät wird wegen seiner tatsächlichen Effizienz und Zuverlässigkeit ausgewählt, nicht wegen seines Preisschilds.",
    viewProduct: "Produkt ansehen",
    addToCart: "Hinzufügen",
    unavailable: "Nicht verfügbar",
    addToCartFull: "In den Warenkorb",
    decrease: "Verringern",
    increase: "Erhöhen",
    decreaseQty: "Menge verringern",
    increaseQty: "Menge erhöhen",
    remove: "Entfernen",
    addedToCart: "zum Warenkorb hinzugefügt",
    howEyebrow: "Lieferung & Installation",
    howTitle: "Von der Bestellung bis zur frischen Luft, in 4 Schritten",
    howSubtitle: "Ein Ablauf, der einfach sein soll — ohne böse Überraschungen und ohne versteckte Verpflichtungen.",
    step1h: "Wählen Sie Ihr Modell", step1p: "Legen Sie das zur Raumgröße passende Klimagerät in den Warenkorb.",
    step2h: "Per Überweisung bezahlen", step2p: "Bei Bestellung erhalten Sie eine Bankverbindung und eine eindeutige Referenz.",
    step3h: "Lieferung innerhalb von 48-72h", step3p: "In ganz Frankreich (Festland) zu einem einheitlichen Pauschalpreis von 35€.",
    step4h: "Kostenlose Installation", step4p: "Ein Fachmann installiert Ihr Gerät direkt bei Ihnen, ohne Zusatzkosten.",
    dzEyebrow: "Liefergebiet",
    dzTitle: "Lieferung in ganz Frankreich (Festland)",
    dzText: "Unser Transporteur-Netzwerk deckt das gesamte Gebiet ab, von den großen Metropolen bis zu mittelgroßen Städten: Paris, Lyon, Marseille, Toulouse, Bordeaux, Nantes, Lille, Straßburg und viele mehr. Die Lieferpauschale bleibt unabhängig von Ihrer Region gleich.",
    dzLi1: "Lieferung innerhalb von 48-72 Werktagsstunden nach Bestätigung der Überweisung",
    dzLi2: "Kostenlose Installation durch einen Fachmann, überall in Festlandfrankreich",
    dzLi3: "Ihr gewünschtes Lieferfenster (morgens, nachmittags, abends) wird berücksichtigt",
    dzMapFrance: "FRANKREICH",
    dzMapLegend: "Aktuelles Liefergebiet: Festlandfrankreich",
    reviewsEyebrow: "Kundenbewertungen",
    reviewsTitle: "Das sagen unsere Kunden",
    reviewsMeta: "Basierend auf 214 verifizierten Bewertungen",
    verifiedPurchase: "Verifizierter Kauf",
    faqEyebrow: "Häufige Fragen",
    faqTitle: "Alles, was Sie vor der Bestellung wissen müssen",
    ctaTitle: "Eine Frage vor der Bestellung?",
    ctaText: "Unser Team antwortet Ihnen schnell auf WhatsApp, ohne Verkaufsgeschwätz.",
    ctaBtn: "Schreiben Sie uns",
    footerDesc: "Ausgewählte Klimageräte, geliefert und kostenlos installiert bei Privatkunden in Frankreich. Zahlung ausschließlich per Banküberweisung.",
    footerBadge1: "Website ohne Werbe-Tracker",
    footerBadge2: "Daten werden minimal gespeichert",
    footerColShop: "Shop",
    footerLink1: "Alle Klimageräte",
    footerColInfo: "Informationen",
    footerCgv: "Allgemeine Geschäftsbedingungen",
    footerRetours: "Rückgabe & Garantie",
    footerConfidentialite: "Datenschutz",
    footerMentions: "Impressum",
    footerColContact: "Kontakt",
    footerContactNote: "Bestellungen werden über WhatsApp abgewickelt",
    cNamePh: "Ihr Name", cEmailPh: "Ihre E-Mail", cMsgPh: "Ihre Nachricht",
    cSubmit: "Nachricht vorbereiten",
    waFastReply: "Schnelle Antwort",
    emailUnavailableShort: "Vorübergehend nicht verfügbar",
    legalNote: "<b>Impressum — vor Veröffentlichung zu vervollständigen:</b> gemäß französischem Recht (LCEN) muss diese Website den Firmennamen, die Rechtsform, die Adresse des Firmensitzes, die SIRET-Nummer und den Namen des Herausgebers angeben. Diese Angaben betreffen nicht den Datenschutz: eine geschäftliche Domizilierungsadresse kann anstelle einer Privatadresse verwendet werden. Ersetzen Sie die Felder \"Impressum\" im Code vor der tatsächlichen Veröffentlichung.",
    footerCopyright: "© 2026 Le CoinClim. Alle Rechte vorbehalten.",
    footerNoCookies: "Website ohne Werbe-Cookies oder Tracker von Drittanbietern.",
    cartTitle: "Ihr Warenkorb",
    drawerTitleCheckout: "Ihre Kontaktdaten",
    drawerTitleThanks: "Danke!",
    cartEmpty: "Ihr Warenkorb ist leer.<br>Fügen Sie ein Klimagerät hinzu, um zu beginnen.",
    checkoutIntro: "Geben Sie Ihre vollständigen Kontaktdaten an: je genauer, desto einfacher die Lieferung und Installation für den Transporteur.",
    checkoutGroupContact: "Ihre Kontaktdaten",
    checkoutNamePh: "Vor- und Nachname",
    checkoutEmailPh: "Ihre E-Mail",
    checkoutPhonePh: "Telefon (der Lieferant ruft Sie vor der Lieferung an)",
    checkoutGroupAddress: "Lieferadresse",
    checkoutAddressPh: "Hausnummer und Straße",
    checkoutAddress2Ph: "Zusatz (Gebäude, Stockwerk, Wohnung)",
    checkoutPostalPh: "Postleitzahl",
    checkoutCityPh: "Stadt",
    countryFrance: "Frankreich (Festland)",
    countryBelgique: "Belgien",
    countrySuisse: "Schweiz",
    countryLuxembourg: "Luxemburg",
    countryAutre: "Anderes europäisches Land",
    checkoutGroupFacilitate: "Lieferung erleichtern",
    slotAny: "Zeitfenster egal",
    slotMorning: "Morgens (8–12 Uhr)",
    slotAfternoon: "Nachmittags (12–18 Uhr)",
    slotEvening: "Abends (18–20 Uhr)",
    checkoutNotesPh: "Zugang: Türcode, Stockwerk, Aufzug, Parkplatz, besondere Hinweise… (optional)",
    checkoutTotalLabel: "Bestellsumme",
    checkoutSubmit: "Bestellung bestätigen",
    backToCart: "Zurück zum Warenkorb",
    confirmTitle: "Bestellung gespeichert",
    confirmText: "Ihre Zusammenfassung ist bereit. Wählen Sie, wie Sie unseren Kundenservice kontaktieren möchten, um Ihre Bestellung zu bestätigen und die Bankverbindung zu erhalten.",
    waDirectExchange: "Schnelle Antwort, direkter Austausch",
    confirmFooterNote: "Für jede Bestellung wenden Sie sich bitte an <b style=\"color:var(--ink);\">WhatsApp unter +49 176 16021496</b>: unser E-Mail-Postfach ist derzeit überlastet.",
    close: "Schließen",
    subtotal: "Zwischensumme",
    delivery: "Lieferung",
    total: "Gesamt",
    orderBtn: "Bestellen",
    emailUnavailableMsg: "Aufgrund einer hohen Nachrichtenanzahl ist die E-Mail-Kommunikation vorübergehend nicht verfügbar. Unser Team arbeitet mit Hochdruck an einer Lösung. Bitte kontaktieren Sie uns für Bestellungen über WhatsApp.",
    checkoutValidationMsg: "Bitte füllen Sie alle Pflichtfelder aus (Name, gültige E-Mail, Telefon, Adresse, Postleitzahl, Stadt).",
    contactMsgReady: "Nachricht bereit — senden Sie sie über WhatsApp.",
    contactValidationMsg: "Bitte füllen Sie alle Felder mit einer gültigen E-Mail-Adresse aus.",
    stockOutOfStock: "Ausverkauft",
    stockInStockPrefix: "auf Lager",
    photoComingSoon: "FOTO FOLGT"
  }
};

function t(key){
  return (I18N[LANG] && I18N[LANG][key] !== undefined) ? I18N[LANG][key] : (I18N.fr[key] !== undefined ? I18N.fr[key] : key);
}

/* ===================== CATALOGUE PRODUITS (embarqué, pas d'appel serveur) ===================== */
let PRODUCTS = [
  {
    "id": "midea-portasplit-12000",
    "name": "Midea PortaSplit 4 en 1 – 12000 BTU",
    "cat": "Climatiseur split mobile",
    "price": 650,
    "oldPrice": null,
    "stockQty": 6,
    "desc": "Le Midea PortaSplit réunit le confort d'un climatiseur split fixe et la simplicité d'un modèle mobile. Son unité extérieure compacte se pose sur un balcon ou un rebord de fenêtre grâce à une simple liaison flexible, sans percement de mur ni intervention d'un frigoriste. En mode 4 en 1, il rafraîchit en été, chauffe en intersaison, déshumidifie l'air ambiant et ventile les pièces jusqu'à 45 m². Sa technologie split réduit fortement le niveau sonore à l'intérieur par rapport à un monobloc classique, pour des nuits calmes même en pleine chaleur. Modèle en fin de série proposé en déstockage, quantités limitées.",
    "specs": [
      "Puissance frigorifique : 12000 BTU (env. 3,5 kW)",
      "Fonctions : froid, chaud, déshumidificateur, ventilateur",
      "Surface recommandée : jusqu'à 45 m²",
      "Installation sans percement, unité extérieure compacte",
      "Télécommande incluse"
    ],
    "images": [
      "images/products/midea-portasplit-12000-1.jpg",
      "images/products/midea-portasplit-12000-2.jpg",
      "images/products/midea-portasplit-12000-3.jpg",
      "images/products/midea-portasplit-12000-4.jpg",
      "images/products/midea-portasplit-12000-5.jpg",
      "images/products/midea-portasplit-12000-6.jpg"
    ],
    "discount": null,
    "stock": "5+ en stock",
    "name_de": "Midea PortaSplit 4-in-1 – 12000 BTU",
    "cat_de": "Mobiles Split-Klimagerät",
    "desc_de": "Der Midea PortaSplit vereint den Komfort eines fest installierten Split-Klimageräts mit der Einfachheit eines mobilen Modells. Die kompakte Außeneinheit wird über eine flexible Leitung einfach auf einem Balkon oder Fensterbrett platziert, ganz ohne Wanddurchbruch oder Kältetechniker. Im 4-in-1-Modus kühlt es im Sommer, heizt in der Übergangszeit, entfeuchtet die Raumluft und belüftet Räume bis zu 45 m². Die Split-Technologie senkt den Innengeräuschpegel deutlich gegenüber einem klassischen Monoblock — für ruhige Nächte auch bei großer Hitze. Auslaufmodell im Sonderverkauf, Stückzahl begrenzt.",
    "specs_de": [
      "Kühlleistung: 12000 BTU (ca. 3,5 kW)",
      "Funktionen: Kühlen, Heizen, Entfeuchten, Ventilator",
      "Empfohlene Fläche: bis zu 45 m²",
      "Installation ohne Wanddurchbruch, kompakte Außeneinheit",
      "Fernbedienung inklusive"
    ]
  },
  {
    "id": "forceclima-7150-style",
    "name": "ForceClima 7150 Style – Climatiseur portatif 7000 BTU",
    "cat": "Climatisation portative",
    "price": 169,
    "oldPrice": 299,
    "stockQty": 5,
    "desc": "Le ForceClima 7150 Style est un climatiseur monobloc mobile pensé pour les petites et moyennes pièces. Compact et léger, il se déplace facilement d'une pièce à l'autre grâce à ses roulettes et se met en route en quelques minutes, kit de fenêtre fourni. Sa fonction déshumidification aide à assainir l'air en période humide et son mode ventilation permet de l'utiliser toute l'année. Le panneau de contrôle digital et la télécommande simplifient le réglage de la température et de la minuterie. Un excellent rapport confort/prix pour équiper rapidement un studio, une chambre ou un bureau. Modèle en déstockage, stock limité.",
    "specs": [
      "Puissance frigorifique : 7000 BTU (env. 2 kW)",
      "Fonctions : froid, déshumidificateur, ventilateur",
      "Surface recommandée : jusqu'à 20 m²",
      "Kit d'évacuation fenêtre inclus",
      "Roulettes de déplacement et télécommande"
    ],
    "images": [
      "images/products/forceclima-7150-style-1.jpg",
      "images/products/forceclima-7150-style-2.jpg",
      "images/products/forceclima-7150-style-3.jpg",
      "images/products/forceclima-7150-style-4.jpg",
      "images/products/forceclima-7150-style-5.jpg",
      "images/products/forceclima-7150-style-6.jpg"
    ],
    "discount": 43,
    "stock": "5+ en stock",
    "name_de": "ForceClima 7150 Style – Tragbares Klimagerät 7000 BTU",
    "cat_de": "Tragbare Klimatisierung",
    "desc_de": "Der ForceClima 7150 Style ist ein mobiles Monoblock-Klimagerät für kleine und mittlere Räume. Kompakt und leicht, lässt es sich dank seiner Rollen problemlos von Raum zu Raum bewegen und ist in wenigen Minuten einsatzbereit, Fensterset inklusive. Die Entfeuchtungsfunktion hilft, die Luft bei feuchtem Wetter zu verbessern, und der Ventilatormodus ermöglicht eine ganzjährige Nutzung. Das digitale Bedienfeld und die Fernbedienung erleichtern die Einstellung von Temperatur und Timer. Ein hervorragendes Preis-Komfort-Verhältnis, um schnell ein Studio, ein Schlafzimmer oder ein Büro auszustatten. Auslaufmodell, begrenzter Bestand.",
    "specs_de": [
      "Kühlleistung: 7000 BTU (ca. 2 kW)",
      "Funktionen: Kühlen, Entfeuchten, Ventilator",
      "Empfohlene Fläche: bis zu 20 m²",
      "Fensterabluftset inklusive",
      "Rollen zum Transport und Fernbedienung"
    ]
  },
  {
    "id": "beko-bp1095cn-9000",
    "name": "Climatiseur mobile connecté BEKO BP1095CN – 9000 BTU",
    "cat": "Climatiseur mobile",
    "price": 199,
    "oldPrice": null,
    "stockQty": 5,
    "desc": "Le BEKO BP1095CN purifie l'air de votre maison tout en vous offrant un confort optimal toute l'année. Avec sa puissance de 9000 BTU et sa puissance frigorifique d'environ 2600 W, il rafraîchit rapidement vos pièces, tandis que sa fonction chauffage apporte un accompagnement pratique au quotidien. Profitez également du pilotage à distance et des commandes vocales pour une utilisation simple, moderne et efficace. Surface de la pièce : 25 à 30 m².",
    "specs": [
      "Puissance : 9000 BTU (env. 2600 W)",
      "Fonctions : froid et chaud",
      "Surface recommandée : 25 à 30 m²",
      "Pilotage à distance et commandes vocales",
      "Composition : climatiseur portable, manuel d'instructions, télécommande, kit d'installation sur fenêtre"
    ],
    "images": [
      "images/products/beko-bp1095cn-9000-1.jpg",
      "images/products/beko-bp1095cn-9000-2.jpg",
      "images/products/beko-bp1095cn-9000-3.jpg",
      "images/products/beko-bp1095cn-9000-4.jpg",
      "images/products/beko-bp1095cn-9000-5.jpg",
      "images/products/beko-bp1095cn-9000-6.jpg"
    ],
    "discount": null,
    "stock": "5+ en stock",
    "name_de": "Vernetztes mobiles Klimagerät BEKO BP1095CN – 9000 BTU",
    "cat_de": "Mobiles Klimagerät",
    "desc_de": "Das BEKO BP1095CN reinigt die Luft in Ihrem Zuhause und bietet Ihnen das ganze Jahr über optimalen Komfort. Mit einer Leistung von 9000 BTU und einer Kühlleistung von etwa 2600 W kühlt es Ihre Räume schnell, während die Heizfunktion eine praktische Ergänzung im Alltag bietet. Nutzen Sie außerdem die Fernsteuerung und Sprachbefehle für eine einfache, moderne und effiziente Bedienung. Raumgröße: 25 bis 30 m².",
    "specs_de": [
      "Leistung: 9000 BTU (ca. 2600 W)",
      "Funktionen: Kühlen und Heizen",
      "Empfohlene Fläche: 25 bis 30 m²",
      "Fernsteuerung und Sprachbefehle",
      "Lieferumfang: tragbares Klimagerät, Bedienungsanleitung, Fernbedienung, Fenster-Installationsset"
    ]
  },
  {
    "id": "trisplit-airclima-27000",
    "name": "TRISPLIT AirClima 27000 Multi Connected",
    "cat": "Multi-split",
    "price": 749,
    "oldPrice": 1149,
    "stockQty": 5,
    "desc": "Le TRISPLIT AirClima 27000 Multi Connected est un système de climatisation multi-split réversible permettant de raccorder jusqu'à trois unités intérieures à une seule unité extérieure. Idéal pour équiper une maison ou un appartement sur plusieurs pièces sans multiplier les groupes extérieurs, il combine performance énergétique, fonctionnement silencieux et pilotage connecté via application mobile pour régler la température de chaque pièce à distance. Chaque zone est réglable indépendamment, en froid comme en chaud, pour un confort optimal toute l'année. Une solution premium pour les foyers qui recherchent une climatisation complète avec une installation professionnelle simplifiée. Modèle en déstockage, disponibilité limitée.",
    "specs": [
      "Puissance totale : 27000 BTU cumulés, 3 zones",
      "Fonctions : froid et chaud (réversible)",
      "Pilotage connecté via application mobile",
      "Réglage indépendant de chaque unité intérieure",
      "Installation par un professionnel recommandée"
    ],
    "images": [
      "images/products/trisplit-airclima-27000-1.jpg",
      "images/products/trisplit-airclima-27000-2.jpg",
      "images/products/trisplit-airclima-27000-3.jpg",
      "images/products/trisplit-airclima-27000-4.jpg",
      "images/products/trisplit-airclima-27000-5.jpg"
    ],
    "discount": 35,
    "stock": "5+ en stock",
    "name_de": "TRISPLIT AirClima 27000 Multi Connected",
    "cat_de": "Multi-Split-System",
    "desc_de": "Das TRISPLIT AirClima 27000 Multi Connected ist ein reversibles Multi-Split-Klimasystem, das bis zu drei Inneneinheiten an eine einzige Außeneinheit anschließen lässt. Ideal, um ein Haus oder eine Wohnung über mehrere Räume auszustatten, ohne mehrere Außengeräte zu benötigen — es vereint Energieeffizienz, leisen Betrieb und vernetzte Steuerung über eine mobile App zur Fernregelung der Temperatur jedes Raums. Jede Zone lässt sich unabhängig regeln, sowohl im Kühl- als auch im Heizbetrieb, für optimalen Komfort das ganze Jahr über. Eine Premiumlösung für Haushalte, die eine komplette Klimatisierung mit vereinfachter professioneller Installation suchen. Auslaufmodell, begrenzte Verfügbarkeit.",
    "specs_de": [
      "Gesamtleistung: 27000 BTU kumuliert, 3 Zonen",
      "Funktionen: Kühlen und Heizen (reversibel)",
      "Vernetzte Steuerung über mobile App",
      "Unabhängige Regelung jeder Inneneinheit",
      "Installation durch einen Fachmann empfohlen"
    ]
  },
  {
    "id": "comfee-breezy-cool-26",
    "name": "COMFEE' Breezy Cool 2.6 – Climatiseur mobile connecté 9000 BTU",
    "cat": "Climatiseur mobile connecté",
    "price": 299,
    "oldPrice": null,
    "stockQty": 6,
    "desc": "Le COMFEE' Breezy Cool 2.6 est la référence entrée de gamme la plus aboutie de sa catégorie : compact, connecté et étonnamment silencieux pour son prix. Son admission d'air à 4 voies augmente le flux de 40% par rapport à la génération précédente, tout en réduisant l'encombrement au sol de 30%. Piloté depuis une application mobile ou à la voix via Alexa et Google Home, il propose 3 modes (froid, ventilateur, déshumidificateur) et 3 vitesses de ventilation. Son mode veille ultra basse consommation (0,5 W) et son gaz réfrigérant naturel R290 en font un choix responsable pour rafraîchir un salon ou une chambre jusqu'à 33 m² sans exploser la facture d'électricité.",
    "specs": [
      "Puissance frigorifique : 9000 BTU (2,6 kW)",
      "Fonctions : froid, ventilateur, déshumidificateur",
      "Surface recommandée : jusqu'à 33 m²",
      "Pilotage via application COMFEE, Alexa et Google Home",
      "Classe énergétique A, gaz réfrigérant naturel R290",
      "Mode veille basse consommation (0,5 W)"
    ],
    "images": [
      "images/products/comfee-breezy-cool-26-1.jpg",
      "images/products/comfee-breezy-cool-26-2.jpg",
      "images/products/comfee-breezy-cool-26-3.jpg"
    ],
    "discount": null,
    "stock": "5+ en stock",
    "name_de": "COMFEE' Breezy Cool 2.6 – Vernetztes mobiles Klimagerät 9000 BTU",
    "cat_de": "Vernetztes mobiles Klimagerät",
    "desc_de": "Der COMFEE' Breezy Cool 2.6 ist die ausgereifteste Einstiegsreferenz seiner Kategorie: kompakt, vernetzt und für seinen Preis überraschend leise. Sein 4-Wege-Lufteinlass erhöht den Luftstrom um 40% gegenüber der Vorgängergeneration und reduziert gleichzeitig den Stellflächenbedarf um 30%. Gesteuert über eine mobile App oder per Sprachbefehl via Alexa und Google Home, bietet es 3 Modi (Kühlen, Ventilator, Entfeuchten) und 3 Gebläsestufen. Der stromsparende Standby-Modus (0,5 W) und das natürliche Kältemittel R290 machen es zu einer verantwortungsvollen Wahl, um ein Wohnzimmer oder Schlafzimmer bis zu 33 m² zu kühlen, ohne die Stromrechnung explodieren zu lassen.",
    "specs_de": [
      "Kühlleistung: 9000 BTU (2,6 kW)",
      "Funktionen: Kühlen, Ventilator, Entfeuchten",
      "Empfohlene Fläche: bis zu 33 m²",
      "Steuerung über COMFEE-App, Alexa und Google Home",
      "Energieklasse A, natürliches Kältemittel R290",
      "Stromsparender Standby-Modus (0,5 W)"
    ]
  },
  {
    "id": "delonghi-pinguino-es72-young",
    "name": "De'Longhi Pinguino Compact ES72 Young – Climatiseur mobile 8300 BTU",
    "cat": "Climatiseur mobile compact",
    "price": 419,
    "oldPrice": 479,
    "stockQty": 5,
    "desc": "Le De'Longhi Pinguino Compact ES72 Young a été pensé pour les petits espaces : moins de 70 cm de hauteur, un encombrement réduit de 40% par rapport à un Pinguino classique, et un fonctionnement jusqu'à 50% plus silencieux que les générations précédentes. Réglé sur sa vitesse minimale, il descend entre 47 et 52 dB, un niveau rare pour un monobloc dans cette gamme de prix. Il embarque un gaz réfrigérant naturel R290 jusqu'à 696 fois plus respectueux de l'environnement que les gaz traditionnels, une fonction déshumidificateur, une minuterie 24h et un écran LCD avec télécommande incluse. Une valeur sûre de la climatisation mobile italienne, pour les chambres et petits salons.",
    "specs": [
      "Puissance frigorifique : 8300 BTU (2,1 kW)",
      "Fonctions : froid, ventilateur, déshumidificateur",
      "Surface recommandée : jusqu'à 60 m³ (environ 24 m²)",
      "Niveau sonore : 47 à 52 dB en vitesse minimale",
      "Gaz réfrigérant naturel R290, classe énergétique A",
      "Écran LCD, minuterie 24h, télécommande incluse"
    ],
    "images": [
      "images/products/delonghi-pinguino-es72-young-1.svg"
    ],
    "discount": 13,
    "stock": "5+ en stock",
    "name_de": "De'Longhi Pinguino Compact ES72 Young – Mobiles Klimagerät 8300 BTU",
    "cat_de": "Kompaktes mobiles Klimagerät",
    "desc_de": "Der De'Longhi Pinguino Compact ES72 Young wurde für kleine Räume entwickelt: weniger als 70 cm Höhe, ein um 40% reduzierter Platzbedarf gegenüber einem klassischen Pinguino und ein bis zu 50% leiserer Betrieb als frühere Generationen. Auf niedrigster Stufe eingestellt, sinkt der Geräuschpegel auf 47 bis 52 dB — ein seltener Wert für einen Monoblock in dieser Preisklasse. Es verfügt über das natürliche Kältemittel R290, das bis zu 696-mal umweltfreundlicher ist als herkömmliche Gase, eine Entfeuchtungsfunktion, einen 24-Stunden-Timer und ein LCD-Display mit Fernbedienung. Eine sichere Wahl der italienischen mobilen Klimatisierung für Schlafzimmer und kleine Wohnzimmer.",
    "specs_de": [
      "Kühlleistung: 8300 BTU (2,1 kW)",
      "Funktionen: Kühlen, Ventilator, Entfeuchten",
      "Empfohlene Fläche: bis zu 60 m³ (ca. 24 m²)",
      "Geräuschpegel: 47 bis 52 dB auf niedrigster Stufe",
      "Natürliches Kältemittel R290, Energieklasse A",
      "LCD-Display, 24-Stunden-Timer, Fernbedienung inklusive"
    ]
  },
  {
    "id": "dreo-ac515s",
    "name": "DREO AC515S – Climatiseur mobile connecté 10000 BTU sans drainage",
    "cat": "Climatiseur mobile connecté",
    "price": 499,
    "oldPrice": null,
    "stockQty": 5,
    "desc": "Le DREO AC515S mise sur le confort de chambre : silence et pilotage intelligent avant la puissance brute. Son système IceCool et son isolation phonique du compresseur le font descendre à environ 45 dB, un des niveaux les plus bas de sa catégorie, idéal pour dormir sans être dérangé. Sa technologie d'auto-évaporation le rend utilisable sans vidange manuelle tant que l'humidité reste sous 90%, ce qui simplifie beaucoup l'entretien au quotidien. Entièrement connecté (application, Siri, Alexa, Google Home), il propose une minuterie 24h et un mode sommeil programmable. Un excellent choix pour une chambre ou un bureau jusqu'à 28-30 m².",
    "specs": [
      "Puissance frigorifique : 10000 BTU (ASHRAE), 8000 BTU SACC",
      "Fonctions : froid, ventilateur, déshumidificateur",
      "Surface recommandée : jusqu'à 28-30 m²",
      "Niveau sonore : environ 45 dB grâce à l'isolation du compresseur",
      "Fonctionnement sans vidange jusqu'à 90% d'humidité",
      "Pilotage application, Siri, Alexa, Google Home ; minuterie 24h"
    ],
    "images": [
      "images/products/dreo-ac515s-1.jpg",
      "images/products/dreo-ac515s-2.jpg",
      "images/products/dreo-ac515s-3.jpg",
      "images/products/dreo-ac515s-4.jpg"
    ],
    "discount": null,
    "stock": "5+ en stock",
    "name_de": "DREO AC515S – Vernetztes mobiles Klimagerät 10000 BTU ohne Kondenswasserablass",
    "cat_de": "Vernetztes mobiles Klimagerät",
    "desc_de": "Der DREO AC515S setzt auf Schlafzimmerkomfort: Stille und intelligente Steuerung vor roher Leistung. Sein IceCool-System und die Schalldämmung des Kompressors senken den Geräuschpegel auf etwa 45 dB — einer der niedrigsten Werte seiner Kategorie, ideal zum ungestörten Schlafen. Die Selbstverdunstungstechnologie ermöglicht den Betrieb ohne manuelles Abpumpen, solange die Luftfeuchtigkeit unter 90% bleibt, was die tägliche Wartung erheblich vereinfacht. Vollständig vernetzt (App, Siri, Alexa, Google Home), bietet es einen 24-Stunden-Timer und einen programmierbaren Schlafmodus. Eine hervorragende Wahl für ein Schlafzimmer oder Büro bis zu 28-30 m².",
    "specs_de": [
      "Kühlleistung: 10000 BTU (ASHRAE), 8000 BTU SACC",
      "Funktionen: Kühlen, Ventilator, Entfeuchten",
      "Empfohlene Fläche: bis zu 28-30 m²",
      "Geräuschpegel: etwa 45 dB dank Kompressor-Schalldämmung",
      "Betrieb ohne Kondenswasserablass bis 90% Luftfeuchtigkeit",
      "Steuerung per App, Siri, Alexa, Google Home; 24-Stunden-Timer"
    ]
  },
  {
    "id": "klarstein-new-breeze-7",
    "name": "Klarstein New Breeze 7 – Climatiseur mobile 7000 BTU",
    "cat": "Climatiseur mobile",
    "price": 279,
    "oldPrice": null,
    "stockQty": 6,
    "desc": "Le Klarstein New Breeze 7 est le climatiseur mobile idéal pour équiper une chambre ou un bureau sans se ruiner. Son design arrondi et longiligne s'intègre facilement dans un intérieur, disponible en noir ou blanc. Avec ses 7000 BTU et son gaz réfrigérant naturel R290, il rafraîchit efficacement des pièces jusqu'à 34 m². Son mode nuit, qui abaisse le niveau sonore à environ 50 dB, en fait une option crédible pour dormir au frais. Fonctions ventilateur et déshumidificateur incluses, minuterie réglable de 30 minutes à 10 heures, et télécommande fournie pour un pilotage simple depuis le canapé ou le lit.",
    "specs": [
      "Puissance frigorifique : 7000 BTU (2,1 kW)",
      "Fonctions : froid, ventilateur, déshumidificateur, mode nuit",
      "Surface recommandée : jusqu'à 34 m²",
      "Niveau sonore : environ 63 dB (jusqu'à 50 dB en mode nuit)",
      "Gaz réfrigérant naturel R290, classe énergétique A",
      "Minuterie 30 min à 10h, télécommande incluse"
    ],
    "images": [
      "images/products/klarstein-new-breeze-7-1.jpg",
      "images/products/klarstein-new-breeze-7-2.jpg",
      "images/products/klarstein-new-breeze-7-3.jpg",
      "images/products/klarstein-new-breeze-7-4.jpg"
    ],
    "discount": null,
    "stock": "5+ en stock",
    "name_de": "Klarstein New Breeze 7 – Mobiles Klimagerät 7000 BTU",
    "cat_de": "Mobiles Klimagerät",
    "desc_de": "Der Klarstein New Breeze 7 ist das ideale mobile Klimagerät, um ein Schlafzimmer oder Büro auszustatten, ohne viel Geld auszugeben. Sein rundes, schlankes Design fügt sich leicht in jedes Interieur ein und ist in Schwarz oder Weiß erhältlich. Mit 7000 BTU und dem natürlichen Kältemittel R290 kühlt es effizient Räume bis zu 34 m². Der Nachtmodus, der den Geräuschpegel auf etwa 50 dB senkt, macht es zu einer glaubwürdigen Option für erholsamen Schlaf im Kühlen. Ventilator- und Entfeuchtungsfunktionen inklusive, Timer von 30 Minuten bis 10 Stunden einstellbar, und Fernbedienung für einfache Steuerung vom Sofa oder Bett aus.",
    "specs_de": [
      "Kühlleistung: 7000 BTU (2,1 kW)",
      "Funktionen: Kühlen, Ventilator, Entfeuchten, Nachtmodus",
      "Empfohlene Fläche: bis zu 34 m²",
      "Geräuschpegel: etwa 63 dB (bis zu 50 dB im Nachtmodus)",
      "Natürliches Kältemittel R290, Energieklasse A",
      "Timer 30 Min. bis 10 Std., Fernbedienung inklusive"
    ]
  },
  {
    "id": "olimpia-splendid-dolceclima-silent-10",
    "name": "Olimpia Splendid Dolceclima Silent 10 WiFi – Climatiseur mobile réversible",
    "cat": "Climatiseur mobile réversible connecté",
    "price": 379,
    "oldPrice": 449,
    "stockQty": 5,
    "desc": "Le Dolceclima Silent 10 WiFi d'Olimpia Splendid allie un design italien soigné à un confort toute saison : réversible, il rafraîchit en été et peut aussi chauffer d'appoint en intersaison grâce à sa fonction pompe à chaleur. Sa Blue Air Technology génère un jet d'air haut et profond qui ne souffle pas directement sur les occupants tout en diffusant le frais plus rapidement dans la pièce. Le WiFi intégré et l'application OS Comfort permettent de piloter température, minuterie et modes depuis un smartphone, où que vous soyez. Écran tactile, télécommande avec thermostat déporté et gaz réfrigérant naturel R290 complètent cet appareil pensé pour les chambres et salons jusqu'à 25 m².",
    "specs": [
      "Puissance frigorifique : 10000 BTU (2,6 kW), réversible (fonction chaud)",
      "Fonctions : froid, chaud, ventilateur, déshumidificateur",
      "Surface recommandée : jusqu'à 25 m²",
      "WiFi intégré, pilotage via application OS Comfort",
      "Gaz réfrigérant naturel R290, classe énergétique A",
      "Panneau tactile, télécommande avec thermostat déporté"
    ],
    "images": [
      "images/products/olimpia-splendid-dolceclima-silent-10-1.svg"
    ],
    "discount": 16,
    "stock": "5+ en stock",
    "name_de": "Olimpia Splendid Dolceclima Silent 10 WiFi – Reversibles mobiles Klimagerät",
    "cat_de": "Vernetztes reversibles mobiles Klimagerät",
    "desc_de": "Der Dolceclima Silent 10 WiFi von Olimpia Splendid verbindet italienisches Design mit ganzjährigem Komfort: reversibel, kühlt es im Sommer und kann dank seiner Wärmepumpenfunktion in der Übergangszeit auch zusätzlich heizen. Die Blue Air Technology erzeugt einen hohen, weitreichenden Luftstrom, der nicht direkt auf die Bewohner bläst und den Raum dennoch schneller abkühlt. Das integrierte WiFi und die OS-Comfort-App ermöglichen die Steuerung von Temperatur, Timer und Modi per Smartphone, egal wo Sie sich befinden. Touchscreen, Fernbedienung mit externem Thermostat und das natürliche Kältemittel R290 vervollständigen dieses Gerät für Schlaf- und Wohnzimmer bis zu 25 m².",
    "specs_de": [
      "Kühlleistung: 10000 BTU (2,6 kW), reversibel (Heizfunktion)",
      "Funktionen: Kühlen, Heizen, Ventilator, Entfeuchten",
      "Empfohlene Fläche: bis zu 25 m²",
      "Integriertes WiFi, Steuerung über OS-Comfort-App",
      "Natürliches Kältemittel R290, Energieklasse A",
      "Touch-Bedienfeld, Fernbedienung mit externem Thermostat"
    ]
  }
];

const DELIVERY_FLAT = 35;
const euro = n => n.toLocaleString("fr-FR", {minimumFractionDigits:2, maximumFractionDigits:2}) + " €";
const findProduct = id => PRODUCTS.find(p => p.id === id);

const REVIEWS = [
  { initials:"ML", name:"Marion L.", loc:"Lyon", rating:5, text:"Livré en 48h comme promis et l'installation gratuite a été faite proprement en moins d'une heure. Le TRISPLIT tourne sans bruit dans les trois chambres.", text_de:"Wie versprochen in 48h geliefert, die kostenlose Installation wurde sauber in weniger als einer Stunde durchgeführt. Das TRISPLIT läuft geräuschlos in allen drei Schlafzimmern.", product:"TRISPLIT AirClima 27000" },
  { initials:"KB", name:"Karim B.", loc:"Toulouse", rating:5, text:"Le virement bancaire m'inquiétait un peu au début mais tout a été très clair : référence, RIB, suivi par e-mail. Le climatiseur Midea est top pour un studio.", text_de:"Die Banküberweisung machte mir anfangs etwas Sorgen, aber alles war sehr klar: Referenz, Bankverbindung, Nachverfolgung. Das Midea-Klimagerät ist super für ein Studio.", product:"Midea PortaSplit 4 en 1" },
  { initials:"SD", name:"Sophie D.", loc:"Nantes", rating:4, text:"Bon rapport qualité prix pour le ForceClima, léger et facile à déplacer entre les pièces. Un peu bruyant en mode fort mais très efficace.", text_de:"Gutes Preis-Leistungs-Verhältnis beim ForceClima, leicht und einfach zwischen den Räumen zu bewegen. Auf höchster Stufe etwas laut, aber sehr effizient.", product:"ForceClima 7150 Style" },
  { initials:"TP", name:"Thomas P.", loc:"Bordeaux", rating:5, text:"Le BEKO connecté est parfait pour piloter la température depuis le téléphone avant de rentrer du travail. Service client réactif.", text_de:"Das vernetzte BEKO ist perfekt, um die Temperatur schon vom Telefon aus zu steuern, bevor man von der Arbeit nach Hause kommt. Reaktionsschneller Kundenservice.", product:"BEKO BP1095CN" },
  { initials:"AV", name:"Amélie V.", loc:"Lille", rating:5, text:"Installation multi-split faite par un professionnel compétent, aucune mauvaise surprise sur le prix annoncé. Je recommande.", text_de:"Multi-Split-Installation durch einen kompetenten Fachmann, keine bösen Überraschungen beim angegebenen Preis. Ich empfehle es weiter.", product:"TRISPLIT AirClima 27000" },
  { initials:"JR", name:"Julien R.", loc:"Marseille", rating:4, text:"Le kit fenêtre du ForceClima s'installe en quelques minutes. Très pratique pour un climatiseur d'appoint l'été.", text_de:"Das Fensterset des ForceClima ist in wenigen Minuten installiert. Sehr praktisch als zusätzliches Klimagerät im Sommer.", product:"ForceClima 7150 Style" }
];

const FAQS = [
  { q:"Comment se passe le paiement ?", a:"Le paiement se fait uniquement par virement bancaire. Après validation de votre commande, celle-ci est envoyée sur WhatsApp : notre équipe vous répond avec une référence unique et notre RIB pour effectuer le virement en toute sécurité, sans jamais saisir de coordonnées bancaires en ligne.",
    q_de:"Wie funktioniert die Zahlung?", a_de:"Die Zahlung erfolgt ausschließlich per Banküberweisung. Nach Bestätigung Ihrer Bestellung wird diese über WhatsApp gesendet: unser Team antwortet Ihnen mit einer eindeutigen Referenz und unserer Bankverbindung, damit Sie die Überweisung sicher tätigen können, ohne jemals Bankdaten online einzugeben." },
  { q:"La livraison est-elle vraiment gratuite ?", a:"La livraison est facturée 35€ forfaitaires partout en France métropolitaine, et l'installation à domicile par un professionnel est offerte sur tous nos modèles.",
    q_de:"Ist die Lieferung wirklich kostenlos?", a_de:"Die Lieferung kostet pauschal 35€ in ganz Festlandfrankreich, und die Installation zu Hause durch einen Fachmann ist bei allen unseren Modellen kostenlos." },
  { q:"Sous quel délai suis-je livré ?", a:"Comptez généralement 48 à 72h ouvrées après réception de votre virement, selon la disponibilité du modèle choisi et votre zone géographique.",
    q_de:"Wie schnell erfolgt die Lieferung?", a_de:"Rechnen Sie in der Regel mit 48 bis 72 Werktagsstunden nach Eingang Ihrer Überweisung, je nach Verfügbarkeit des gewählten Modells und Ihrer geografischen Lage." },
  { q:"Les climatiseurs sont-ils garantis ?", a:"Oui, tous nos appareils bénéficient d'une garantie de 2 ans pièces et main d'œuvre.",
    q_de:"Haben die Klimageräte Garantie?", a_de:"Ja, alle unsere Geräte haben eine 2-jährige Garantie auf Teile und Arbeitszeit." },
  { q:"Puis-je changer d'avis après ma commande ?", a:"Oui, contactez-nous sur WhatsApp avant l'installation et nous annulerons ou modifierons votre commande sans frais.",
    q_de:"Kann ich meine Meinung nach der Bestellung ändern?", a_de:"Ja, kontaktieren Sie uns vor der Installation über WhatsApp und wir stornieren oder ändern Ihre Bestellung kostenlos." }
];

function saveCart(){
  // Le panier reste une préférence d'affichage côté client (aucune donnée
  // sensible) : le prix et le stock réels sont toujours revérifiés par le
  // serveur au moment de la commande, jamais fournis par le navigateur.
  localStorage.setItem("coinclim_cart", JSON.stringify(cart));
  // Purge les lignes qui référenceraient un produit qui n'existe plus.
  cart = cart.filter(l => findProduct(l.id));
  renderCartCount();
}

/* ===================== HELPERS: TRADUCTION DES DONNÉES DYNAMIQUES ===================== */
function pName(p){ return LANG === "de" && p.name_de ? p.name_de : p.name; }
function pCat(p){ return LANG === "de" && p.cat_de ? p.cat_de : p.cat; }
function pDesc(p){ return LANG === "de" && p.desc_de ? p.desc_de : p.desc; }
function pSpecs(p){ return LANG === "de" && p.specs_de ? p.specs_de : p.specs; }
function stockLabel(stockStr){
  if(stockStr === "Rupture de stock") return t("stockOutOfStock");
  const m = /^(\d+\+?)\s*en stock$/.exec(stockStr || "");
  if(m) return `${m[1]} ${t("stockInStockPrefix")}`;
  return stockStr;
}

/* ===================== RENDER: PRODUCT CARDS ===================== */
function renderProducts(){
  const grid = document.getElementById("productsGrid");
  const products = PRODUCTS;
  grid.innerHTML = products.map(p => {
    const discount = p.oldPrice ? Math.round((1 - p.price/p.oldPrice) * 100) : null;
    const outOfStock = p.stock === "Rupture de stock";
    return `
    <div class="product-card reveal">
      <div class="product-media" data-open-modal="${p.id}">
        ${discount ? `<span class="badge">-${discount}%</span>` : ""}
        <span class="badge-stock">${stockLabel(p.stock)}</span>
        <img src="${p.images[0]}" alt="${pName(p)}" loading="lazy">
      </div>
      <div class="product-body">
        <span class="cat">${pCat(p)}</span>
        <h3>${pName(p)}</h3>
        <div class="chip-row">${pSpecs(p).slice(0,2).map(s=>`<span class="chip">${s.split(",")[0].split(" adapté")[0].slice(0,26)}</span>`).join("")}</div>
        <div class="price-row">
          <span class="price-now num">${euro(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old num">${euro(p.oldPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          <button class="btn btn-ghost" data-open-modal="${p.id}">${t("viewProduct")}</button>
          <button class="btn btn-primary" data-add-cart="${p.id}" ${outOfStock ? "disabled" : ""}>${outOfStock ? t("unavailable") : t("addToCart")}</button>
        </div>
      </div>
    </div>`;
  }).join("");
}

/* ===================== RENDER: REVIEWS ===================== */
function renderReviews(){
  const grid = document.getElementById("reviewsGrid");
  grid.innerHTML = REVIEWS.map(r => `
    <div class="review-card reveal">
      <div class="review-top">
        <div class="review-avatar-row">
          <span class="avatar">${r.initials}</span>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-loc">${r.loc}</div>
          </div>
        </div>
        <div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div>
      </div>
      <p class="review-text">« ${LANG === "de" && r.text_de ? r.text_de : r.text} »</p>
      <span class="review-tag">${r.product}</span>
      <div class="verified"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>${t("verifiedPurchase")}</div>
    </div>
  `).join("");
}

/* ===================== RENDER: FAQ ===================== */
function renderFaq(){
  const list = document.getElementById("faqList");
  list.innerHTML = FAQS.map((f,i) => `
    <details class="faq-item">
      <summary class="faq-q">${LANG === "de" && f.q_de ? f.q_de : f.q}<span class="plus">+</span></summary>
      <div class="faq-a">${LANG === "de" && f.a_de ? f.a_de : f.a}</div>
    </details>
  `).join("");
}

/* ===================== CART LOGIC ===================== */
function addToCart(id, qty=1){
  const existing = cart.find(l => l.id === id);
  if(existing) existing.qty += qty;
  else cart.push({id, qty});
  saveCart();
  renderCartView();
  const p = findProduct(id);
  showToast(`${pName(p)} ${t("addedToCart")}`);
  openCart();
}

function updateQty(id, delta){
  const line = cart.find(l => l.id === id);
  if(!line) return;
  line.qty += delta;
  if(line.qty <= 0) cart = cart.filter(l => l.id !== id);
  saveCart();
  renderCartView();
}

function removeLine(id){
  cart = cart.filter(l => l.id !== id);
  saveCart();
  renderCartView();
}

function cartSubtotal(){
  return cart.reduce((sum,l) => sum + (findProduct(l.id)?.price || 0) * l.qty, 0);
}

function renderCartCount(){
  const count = cart.reduce((s,l)=>s+l.qty,0);
  const el = document.getElementById("cartCount");
  el.textContent = count;
  el.hidden = count === 0;
}

function renderCartView(){
  const view = document.getElementById("cartView");
  const foot = document.getElementById("drawerFoot");
  if(cart.length === 0){
    view.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L22 8H6"/></svg>
        <p>${t("cartEmpty")}</p>
      </div>`;
    foot.style.display = "none";
    return;
  }
  foot.style.display = "block";
  view.innerHTML = cart.map(l => {
    const p = findProduct(l.id);
    return `
    <div class="cart-line">
      <img src="${p.images[0]}" alt="${pName(p)}">
      <div class="cart-line-info">
        <h5>${pName(p)}</h5>
        <div class="p num">${euro(p.price)}</div>
        <div class="qty-ctrl">
          <button data-qty-minus="${p.id}" aria-label="${t("decreaseQty")}">−</button>
          <span>${l.qty}</span>
          <button data-qty-plus="${p.id}" aria-label="${t("increaseQty")}">+</button>
        </div>
        <button class="remove-line" data-remove="${p.id}">${t("remove")}</button>
      </div>
    </div>`;
  }).join("");

  const subtotal = cartSubtotal();
  const total = subtotal + DELIVERY_FLAT;
  document.getElementById("sumSubtotal").textContent = euro(subtotal);
  document.getElementById("sumDelivery").textContent = euro(DELIVERY_FLAT);
  document.getElementById("sumTotal").textContent = euro(total);
}

/* ===================== DRAWER CONTROL ===================== */
const overlay = document.getElementById("overlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartView = document.getElementById("cartView");
const checkoutView = document.getElementById("checkoutView");
const confirmView = document.getElementById("confirmView");
const drawerFoot = document.getElementById("drawerFoot");

function openCart(){
  renderCartView();
  cartView.style.display = "block";
  checkoutView.classList.remove("active");
  confirmView.classList.remove("active");
  document.getElementById("drawerTitle").textContent = t("cartTitle");
  cartDrawer.classList.add("active");
  overlay.classList.add("active");
}
function closeCart(){
  cartDrawer.classList.remove("active");
  overlay.classList.remove("active");
}
document.getElementById("cartOpenBtn").addEventListener("click", openCart);
document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
overlay.addEventListener("click", () => { closeCart(); closeModal(); });

/* ===================== CHECKOUT FLOW ===================== */
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if(cart.length === 0) return;
  document.getElementById("checkoutTotal").textContent = `${t("checkoutTotalLabel")} : ${euro(cartSubtotal() + DELIVERY_FLAT)}`;
  cartView.style.display = "none";
  checkoutView.classList.add("active");
  document.getElementById("drawerTitle").textContent = t("drawerTitleCheckout");
  drawerFoot.style.display = "none";
});

document.getElementById("backToCartBtn").addEventListener("click", () => {
  checkoutView.classList.remove("active");
  cartView.style.display = "block";
  document.getElementById("drawerTitle").textContent = t("cartTitle");
  drawerFoot.style.display = "block";
});

function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

document.getElementById("confirmPaidBtn").addEventListener("click", () => {
  const nameEl = document.getElementById("checkoutName");
  const emailEl = document.getElementById("checkoutEmail");
  const phoneEl = document.getElementById("checkoutPhone");
  const addressEl = document.getElementById("checkoutAddress");
  const address2El = document.getElementById("checkoutAddress2");
  const postalEl = document.getElementById("checkoutPostal");
  const cityEl = document.getElementById("checkoutCity");
  const countryEl = document.getElementById("checkoutCountry");
  const slotEl = document.getElementById("checkoutSlot");
  const notesEl = document.getElementById("checkoutNotes");
  const honeypot = document.getElementById("checkoutWebsite").value;

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const phone = phoneEl.value.trim();
  const address = addressEl.value.trim();
  const address2 = address2El.value.trim();
  const postal = postalEl.value.trim();
  const city = cityEl.value.trim();
  const country = countryEl.value;
  const slot = slotEl.value;
  const notes = notesEl.value.trim();

  if(honeypot){ return; } // bot trap, silently ignore

  const required = [
    [name, nameEl], [isValidEmail(email) ? "ok" : "", emailEl],
    [phone, phoneEl], [address, addressEl], [postal, postalEl], [city, cityEl]
  ];
  const firstInvalid = required.find(([v]) => !v);
  if(firstInvalid){
    showToast(t("checkoutValidationMsg"));
    firstInvalid[1].focus();
    return;
  }
  if(cart.length === 0) return;

  const confirmBtn = document.getElementById("confirmPaidBtn");
  confirmBtn.disabled = true;

  const subtotal = cartSubtotal();
  const total = subtotal + DELIVERY_FLAT;

  const lines = cart.map(l => {
    const p = findProduct(l.id);
    return `• ${p.name} — x${l.qty} — ${euro(p.price * l.qty)}`;
  }).join("\n");

  const fullAddress = `${address}${address2 ? ", " + address2 : ""}, ${postal} ${city}, ${country}`;

  const message =
`Bonjour Le CoinClim, je souhaite passer la commande suivante :

${lines}

Sous-total : ${euro(subtotal)}
Livraison : ${euro(DELIVERY_FLAT)}
Total : ${euro(total)}

Mes coordonnées :
Nom : ${name}
E-mail : ${email}
Téléphone : ${phone}
Adresse de livraison : ${fullAddress}
Créneau souhaité : ${slot}
Instructions d'accès : ${notes || "—"}`;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  document.getElementById("waConfirmLink").href = waUrl;
  // L'option e-mail (Gmail) est temporairement désactivée : voir le gestionnaire de clic dédié plus bas.

  cart = [];
  saveCart();
  nameEl.value = ""; emailEl.value = ""; phoneEl.value = "";
  addressEl.value = ""; address2El.value = ""; postalEl.value = ""; cityEl.value = "";
  countryEl.value = "France"; slotEl.value = "Peu importe"; notesEl.value = "";
  checkoutView.classList.remove("active");
  confirmView.classList.add("active");
  document.getElementById("drawerTitle").textContent = t("drawerTitleThanks");

  confirmBtn.disabled = false;
});

document.getElementById("closeConfirmBtn").addEventListener("click", () => {
  confirmView.classList.remove("active");
  document.getElementById("checkoutName").value = "";
  document.getElementById("checkoutEmail").value = "";
  closeCart();
});

/* ===================== CART EVENT DELEGATION ===================== */
document.getElementById("drawerBody").addEventListener("click", (e) => {
  const minus = e.target.closest("[data-qty-minus]");
  const plus = e.target.closest("[data-qty-plus]");
  const rem = e.target.closest("[data-remove]");
  if(minus) updateQty(minus.dataset.qtyMinus, -1);
  if(plus) updateQty(plus.dataset.qtyPlus, 1);
  if(rem) removeLine(rem.dataset.remove);
});

/* ===================== PRODUCT MODAL ===================== */
const modalOverlay = document.getElementById("modalOverlay");
const modalBox = document.getElementById("modalBox");
let modalQty = 1;
let currentModalProductId = null;

function openModal(id){
  currentModalProductId = id;
  const p = findProduct(id);
  modalQty = 1;
  modalBox.innerHTML = `
    <button class="modal-close" id="modalCloseBtn" aria-label="${t("close")}">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0F2B3D" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal-gallery">
      <div class="modal-gallery-main"><img id="modalMainImg" src="${p.images[0]}" alt="${pName(p)}"></div>
      <div class="modal-thumbs">
        ${p.images.map((img,i)=>`<button data-thumb="${i}" class="${i===0?'active':''}"><img src="${img}" alt=""></button>`).join("")}
      </div>
    </div>
    <div class="modal-info">
      <span class="cat">${pCat(p)}</span>
      <h2>${pName(p)}</h2>
      <div class="modal-price-row">
        <span class="price-now num">${euro(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old num">${euro(p.oldPrice)}</span>` : ""}
      </div>
      <p class="modal-desc">${pDesc(p)}</p>
      <ul class="modal-specs">${pSpecs(p).map(s=>`<li>${s}</li>`).join("")}</ul>
      <div class="modal-qty-row">
        <div class="qty-ctrl">
          <button id="modalQtyMinus" aria-label="${t("decrease")}">−</button>
          <span id="modalQtyVal">1</span>
          <button id="modalQtyPlus" aria-label="${t("increase")}">+</button>
        </div>
        <button class="btn btn-primary" id="modalAddBtn" style="flex:1;" ${p.stock === "Rupture de stock" ? "disabled" : ""}>${p.stock === "Rupture de stock" ? t("unavailable") : t("addToCartFull")}</button>
      </div>
    </div>
  `;
  modalOverlay.classList.add("active");
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  modalBox.querySelectorAll("[data-thumb]").forEach(btn => {
    btn.addEventListener("click", () => {
      modalBox.querySelectorAll("[data-thumb]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("modalMainImg").src = p.images[+btn.dataset.thumb];
    });
  });
  document.getElementById("modalQtyMinus").addEventListener("click", () => {
    modalQty = Math.max(1, modalQty-1);
    document.getElementById("modalQtyVal").textContent = modalQty;
  });
  document.getElementById("modalQtyPlus").addEventListener("click", () => {
    modalQty += 1;
    document.getElementById("modalQtyVal").textContent = modalQty;
  });
  document.getElementById("modalAddBtn").addEventListener("click", () => {
    addToCart(p.id, modalQty);
    closeModal();
  });
}
function closeModal(){
  modalOverlay.classList.remove("active");
  modalBox.innerHTML = "";
  currentModalProductId = null;
}

document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open-modal]");
  const addBtn = e.target.closest("[data-add-cart]");
  if(openBtn) openModal(openBtn.dataset.openModal);
  if(addBtn) addToCart(addBtn.dataset.addCart, 1);
});

/* ===================== MOBILE NAV ===================== */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});
mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mainNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}));

/* ===================== CONTACT FORM ===================== */
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const honeypot = e.target.website.value;
  if(honeypot){ return; } // bot trap, silently ignore

  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const message = document.getElementById("cMsg").value.trim();
  if(!name || !isValidEmail(email) || !message){
    showToast(t("contactValidationMsg"));
    return;
  }

  // Site statique sans backend : le message est préparé pour WhatsApp et Gmail,
  // l'internaute choisit lui-même comment l'envoyer.
  const waMessage =
`Bonjour Le CoinClim, je vous contacte depuis le site :

Nom : ${name}
E-mail : ${email}
Message : ${message}`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
  document.getElementById("waContactLink").href = waUrl;
  // L'option e-mail (Gmail) est temporairement désactivée : voir le gestionnaire de clic dédié plus bas.

  document.getElementById("contactChoice").hidden = false;
  showToast(t("contactMsgReady"));
  e.target.reset();
});

/* ===================== FOOTER INFO PAGES (CGV, Retours, Confidentialité, Mentions légales) ===================== */
const INFO_PAGES = {
  cgv: {
    fr: {
      title: "Conditions générales de vente",
      html: `
        <span class="info-updated">Le CoinClim — dernière mise à jour : à compléter avant mise en ligne</span>
        <h3>Article 1 — Objet</h3>
        <p>Les présentes conditions générales de vente régissent les ventes de climatiseurs proposées par Le CoinClim aux particuliers résidant en France métropolitaine (et pays limitrophes selon disponibilité). Toute commande implique l'acceptation sans réserve des présentes CGV.</p>
        <h3>Article 2 — Produits et prix</h3>
        <p>Les climatiseurs proposés sont décrits aussi précisément que possible. Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison qui sont facturés en supplément au tarif forfaitaire indiqué sur le site.</p>
        <h3>Article 3 — Commande</h3>
        <p>La commande s'effectue en ligne via le panier du site. Elle est ensuite transmise à notre service client par WhatsApp ou par e-mail, qui confirme la disponibilité, communique une référence de commande et le RIB pour le règlement.</p>
        <h3>Article 4 — Paiement</h3>
        <p>Le paiement s'effectue exclusivement par virement bancaire, à réception du RIB et de la référence de commande transmis par notre service client. La commande est traitée dès réception confirmée du virement.</p>
        <h3>Article 5 — Livraison</h3>
        <p>La livraison est assurée sous 48 à 72h ouvrées après réception du virement, partout en France métropolitaine, pour un forfait unique précisé au récapitulatif de commande. Le client s'engage à fournir une adresse et des coordonnées exactes pour faciliter la livraison.</p>
        <h3>Article 6 — Installation</h3>
        <p>L'installation standard est offerte et réalisée par un professionnel lors de la livraison, sous réserve de faisabilité technique du logement (accès, type de fenêtre, configuration électrique).</p>
        <h3>Article 7 — Droit de rétractation</h3>
        <p>Conformément à l'article L221-18 du Code de la consommation, le client dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation, sauf si le climatiseur a déjà été installé et mis en service à sa demande expresse.</p>
        <h3>Article 8 — Litiges</h3>
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité avant toute action judiciaire.</p>
        <p style="margin-top:18px; font-size:12.5px;"><b>À compléter avant mise en ligne réelle :</b> dénomination sociale, forme juridique, capital, SIRET, adresse de l'entreprise.</p>
      `
    },
    de: {
      title: "Allgemeine Geschäftsbedingungen",
      html: `
        <span class="info-updated">Le CoinClim — letzte Aktualisierung: vor Veröffentlichung zu vervollständigen</span>
        <h3>Artikel 1 — Gegenstand</h3>
        <p>Diese Allgemeinen Geschäftsbedingungen regeln den Verkauf von Klimageräten durch Le CoinClim an Privatpersonen mit Wohnsitz in Festlandfrankreich (und angrenzenden Ländern, je nach Verfügbarkeit). Jede Bestellung setzt die vorbehaltlose Annahme dieser AGB voraus.</p>
        <h3>Artikel 2 — Produkte und Preise</h3>
        <p>Die angebotenen Klimageräte werden so genau wie möglich beschrieben. Die Preise verstehen sich in Euro, inklusive aller Steuern, zuzüglich Lieferkosten, die zusätzlich zum auf der Website angegebenen Pauschalpreis berechnet werden.</p>
        <h3>Artikel 3 — Bestellung</h3>
        <p>Die Bestellung erfolgt online über den Warenkorb der Website. Sie wird anschließend über WhatsApp oder E-Mail an unseren Kundenservice übermittelt, der die Verfügbarkeit bestätigt und eine Bestellreferenz sowie die Bankverbindung für die Zahlung mitteilt.</p>
        <h3>Artikel 4 — Zahlung</h3>
        <p>Die Zahlung erfolgt ausschließlich per Banküberweisung nach Erhalt der Bankverbindung und der Bestellreferenz von unserem Kundenservice. Die Bestellung wird nach bestätigtem Zahlungseingang bearbeitet.</p>
        <h3>Artikel 5 — Lieferung</h3>
        <p>Die Lieferung erfolgt innerhalb von 48 bis 72 Werktagsstunden nach Zahlungseingang, in ganz Festlandfrankreich, zu einem in der Bestellzusammenfassung angegebenen einheitlichen Pauschalpreis. Der Kunde verpflichtet sich, eine genaue Adresse und Kontaktdaten anzugeben, um die Lieferung zu erleichtern.</p>
        <h3>Artikel 6 — Installation</h3>
        <p>Die Standardinstallation ist kostenlos und wird bei der Lieferung durch einen Fachmann durchgeführt, vorbehaltlich der technischen Machbarkeit vor Ort (Zugang, Fenstertyp, Elektroinstallation).</p>
        <h3>Artikel 7 — Widerrufsrecht</h3>
        <p>Gemäß Artikel L221-18 des französischen Verbrauchergesetzbuches hat der Kunde ein Widerrufsrecht von 14 Tagen ab Erhalt des Produkts, es sei denn, das Klimagerät wurde auf ausdrücklichen Wunsch bereits installiert und in Betrieb genommen.</p>
        <h3>Artikel 8 — Streitigkeiten</h3>
        <p>Diese AGB unterliegen französischem Recht. Im Streitfall wird vorrangig eine gütliche Einigung angestrebt, bevor rechtliche Schritte eingeleitet werden.</p>
        <p style="margin-top:18px; font-size:12.5px;"><b>Vor tatsächlicher Veröffentlichung zu vervollständigen:</b> Firmenname, Rechtsform, Kapital, SIRET-Nummer, Unternehmensadresse.</p>
      `
    }
  },
  retours: {
    fr: {
      title: "Retours & garantie",
      html: `
        <span class="info-updated">Le CoinClim — modalités applicables à toute commande</span>
        <h3>Garantie légale de conformité</h3>
        <p>Tous nos climatiseurs bénéficient de la garantie légale de conformité de 2 ans prévue par les articles L217-3 et suivants du Code de la consommation. Elle couvre les défauts existants au moment de la livraison et vous dispense de prouver le défaut durant les 24 premiers mois.</p>
        <h3>Garantie commerciale du fabricant</h3>
        <p>En complément, chaque modèle bénéficie de la garantie commerciale de son fabricant (généralement 2 à 3 ans selon la marque), qui couvre les pannes liées à un défaut de fabrication dans les conditions normales d'utilisation.</p>
        <h3>Retour d'un produit non installé</h3>
        <p>Vous disposez de 14 jours après réception pour nous signaler votre souhait de retourner un appareil non installé et en parfait état, dans son emballage d'origine. Contactez notre service client par WhatsApp ou e-mail pour organiser la reprise.</p>
        <ul>
          <li>Le produit doit être complet, non endommagé et non installé.</li>
          <li>Les frais de retour sont à la charge du client, sauf erreur ou défaut de notre part.</li>
          <li>Le remboursement intervient sous 14 jours après réception et vérification du retour.</li>
        </ul>
        <h3>Panne ou défaut après installation</h3>
        <p>En cas de panne, contactez notre service client avec votre référence de commande. Selon le diagnostic, nous organisons une réparation, un remplacement de pièce ou un échange, conformément à la garantie applicable.</p>
        <h3>Exclusions</h3>
        <p>La garantie ne couvre pas les dommages résultant d'une mauvaise utilisation, d'un défaut d'entretien (filtre non nettoyé, par exemple), d'une installation non conforme réalisée par un tiers non habilité, ou d'un choc accidentel.</p>
      `
    },
    de: {
      title: "Rückgabe & Garantie",
      html: `
        <span class="info-updated">Le CoinClim — Bedingungen für jede Bestellung</span>
        <h3>Gesetzliche Konformitätsgarantie</h3>
        <p>Alle unsere Klimageräte haben eine gesetzliche Konformitätsgarantie von 2 Jahren gemäß den Artikeln L217-3 ff. des französischen Verbrauchergesetzbuches. Sie deckt Mängel ab, die bereits bei Lieferung bestanden, und Sie müssen den Mangel in den ersten 24 Monaten nicht nachweisen.</p>
        <h3>Herstellergarantie</h3>
        <p>Zusätzlich profitiert jedes Modell von der Herstellergarantie (in der Regel 2 bis 3 Jahre je nach Marke), die Ausfälle aufgrund von Herstellungsfehlern bei normaler Nutzung abdeckt.</p>
        <h3>Rückgabe eines nicht installierten Produkts</h3>
        <p>Sie haben 14 Tage nach Erhalt Zeit, uns Ihren Wunsch mitzuteilen, ein nicht installiertes Gerät in einwandfreiem Zustand und Originalverpackung zurückzugeben. Kontaktieren Sie unseren Kundenservice über WhatsApp oder E-Mail, um die Rücknahme zu organisieren.</p>
        <ul>
          <li>Das Produkt muss vollständig, unbeschädigt und nicht installiert sein.</li>
          <li>Die Rücksendekosten trägt der Kunde, außer bei einem Fehler unsererseits.</li>
          <li>Die Rückerstattung erfolgt innerhalb von 14 Tagen nach Erhalt und Prüfung der Rücksendung.</li>
        </ul>
        <h3>Ausfall oder Mangel nach der Installation</h3>
        <p>Kontaktieren Sie im Falle eines Ausfalls unseren Kundenservice mit Ihrer Bestellreferenz. Je nach Diagnose organisieren wir eine Reparatur, einen Teileaustausch oder einen Umtausch gemäß der geltenden Garantie.</p>
        <h3>Ausschlüsse</h3>
        <p>Die Garantie deckt keine Schäden ab, die durch unsachgemäße Nutzung, mangelnde Wartung (z. B. ungereinigter Filter), eine nicht fachgerechte Installation durch Dritte oder einen Unfallschaden entstehen.</p>
      `
    }
  },
  confidentialite: {
    fr: {
      title: "Politique de confidentialité",
      html: `
        <span class="info-updated">Conforme au RGPD — Le CoinClim</span>
        <h3>Responsable de traitement</h3>
        <p>Le CoinClim est responsable du traitement des données personnelles collectées via ce site, dans le cadre strict du traitement des commandes et de la relation client.</p>
        <h3>Données collectées</h3>
        <p>Lors d'une commande ou d'une prise de contact, nous collectons uniquement : nom, e-mail, téléphone, adresse de livraison complète (rue, complément, code postal, ville, pays), créneau de livraison souhaité et instructions d'accès éventuelles. Aucune donnée bancaire n'est collectée ou stockée par le site : le règlement s'effectue par virement bancaire directement entre vous et votre banque.</p>
        <h3>Finalité et base légale</h3>
        <p>Ces données sont utilisées exclusivement pour traiter votre commande, organiser la livraison et l'installation, et répondre à vos demandes. Le traitement repose sur l'exécution du contrat de vente ou sur votre consentement pour une simple prise de contact.</p>
        <h3>Durée de conservation</h3>
        <p>Les données sont conservées le temps strictement nécessaire au traitement de la commande et aux obligations légales de facturation, puis supprimées ou archivées de façon sécurisée.</p>
        <h3>Destinataires</h3>
        <p>Vos données ne sont transmises qu'à notre équipe et, le cas échéant, au transporteur en charge de la livraison. Elles ne sont ni vendues ni cédées à des tiers à des fins commerciales.</p>
        <h3>Vos droits</h3>
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition sur vos données. Pour exercer ces droits, contactez-nous à <b>contact@lecoinclim.fr</b>.</p>
        <h3>Cookies et traceurs</h3>
        <p>Ce site ne dépose aucun cookie publicitaire ni traceur tiers. Il ne fait appel à aucun outil d'analyse d'audience nécessitant un consentement.</p>
      `
    },
    de: {
      title: "Datenschutzerklärung",
      html: `
        <span class="info-updated">DSGVO-konform — Le CoinClim</span>
        <h3>Verantwortlicher für die Datenverarbeitung</h3>
        <p>Le CoinClim ist verantwortlich für die Verarbeitung personenbezogener Daten, die über diese Website erhoben werden, ausschließlich im Rahmen der Bestellabwicklung und der Kundenbeziehung.</p>
        <h3>Erhobene Daten</h3>
        <p>Bei einer Bestellung oder Kontaktaufnahme erheben wir ausschließlich: Name, E-Mail, Telefonnummer, vollständige Lieferadresse (Straße, Zusatz, Postleitzahl, Stadt, Land), gewünschtes Lieferfenster und eventuelle Zugangshinweise. Es werden keine Bankdaten von der Website erhoben oder gespeichert: die Zahlung erfolgt per Banküberweisung direkt zwischen Ihnen und Ihrer Bank.</p>
        <h3>Zweck und Rechtsgrundlage</h3>
        <p>Diese Daten werden ausschließlich zur Bearbeitung Ihrer Bestellung, zur Organisation von Lieferung und Installation sowie zur Beantwortung Ihrer Anfragen verwendet. Die Verarbeitung stützt sich auf die Erfüllung des Kaufvertrags oder auf Ihre Einwilligung bei einer einfachen Kontaktaufnahme.</p>
        <h3>Aufbewahrungsdauer</h3>
        <p>Die Daten werden nur so lange aufbewahrt, wie es für die Bearbeitung der Bestellung und die gesetzlichen Rechnungslegungspflichten unbedingt erforderlich ist, und anschließend sicher gelöscht oder archiviert.</p>
        <h3>Empfänger</h3>
        <p>Ihre Daten werden nur an unser Team und gegebenenfalls an den mit der Lieferung beauftragten Transporteur weitergegeben. Sie werden weder verkauft noch zu kommerziellen Zwecken an Dritte weitergegeben.</p>
        <h3>Ihre Rechte</h3>
        <p>Gemäß DSGVO haben Sie ein Recht auf Auskunft, Berichtigung, Löschung und Widerspruch bezüglich Ihrer Daten. Um diese Rechte auszuüben, kontaktieren Sie uns unter <b>contact@lecoinclim.fr</b>.</p>
        <h3>Cookies und Tracker</h3>
        <p>Diese Website verwendet keine Werbe-Cookies oder Tracker von Drittanbietern. Es werden keine Analysetools eingesetzt, die eine Einwilligung erfordern.</p>
      `
    }
  },
  mentions: {
    fr: {
      title: "Mentions légales",
      html: `
        <span class="info-updated">À compléter avant mise en ligne réelle</span>
        <h3>Éditeur du site</h3>
        <p>Le CoinClim — [Forme juridique à compléter], au capital de [montant à compléter], immatriculée au RCS de [ville à compléter] sous le numéro SIRET [à compléter]. Siège social ou adresse de domiciliation : [adresse à compléter]. Directeur de la publication : [nom à compléter].</p>
        <h3>Hébergement</h3>
        <p>[Nom de l'hébergeur, adresse et contact à compléter avant mise en ligne].</p>
        <h3>Contact</h3>
        <p>Pour toute question relative au site ou à une commande : <b>contact@lecoinclim.fr</b> ou WhatsApp au <b>+49 176 16021496</b>.</p>
        <h3>Propriété intellectuelle</h3>
        <p>L'ensemble des contenus présents sur ce site (textes, visuels, structure) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation préalable est interdite.</p>
        <h3>Médiation de la consommation</h3>
        <p>Conformément à l'article L616-1 du Code de la consommation, en cas de litige non résolu directement avec notre service client, vous pouvez recourir gratuitement à un médiateur de la consommation [nom et coordonnées du médiateur à compléter].</p>
        <p style="margin-top:18px; font-size:12.5px;"><b>Rappel :</b> conformément à la loi française (LCEN), ces informations doivent être complétées avec les données réelles de l'entreprise avant toute mise en ligne commerciale.</p>
      `
    },
    de: {
      title: "Impressum",
      html: `
        <span class="info-updated">Vor tatsächlicher Veröffentlichung zu vervollständigen</span>
        <h3>Herausgeber der Website</h3>
        <p>Le CoinClim — [Rechtsform zu vervollständigen], mit einem Kapital von [Betrag zu vervollständigen], eingetragen im Handelsregister von [Stadt zu vervollständigen] unter der SIRET-Nummer [zu vervollständigen]. Firmensitz oder Domizilierungsadresse: [Adresse zu vervollständigen]. Verantwortlich für die Veröffentlichung: [Name zu vervollständigen].</p>
        <h3>Hosting</h3>
        <p>[Name des Hosting-Anbieters, Adresse und Kontakt vor Veröffentlichung zu vervollständigen].</p>
        <h3>Kontakt</h3>
        <p>Für Fragen zur Website oder zu einer Bestellung: <b>contact@lecoinclim.fr</b> oder WhatsApp unter <b>+49 176 16021496</b>.</p>
        <h3>Geistiges Eigentum</h3>
        <p>Alle Inhalte dieser Website (Texte, Bilder, Struktur) sind durch das Recht des geistigen Eigentums geschützt. Jede Vervielfältigung ohne vorherige Genehmigung ist untersagt.</p>
        <h3>Verbraucherschlichtung</h3>
        <p>Gemäß Artikel L616-1 des französischen Verbrauchergesetzbuches können Sie bei einem Streitfall, der nicht direkt mit unserem Kundenservice gelöst werden konnte, kostenlos einen Verbraucherschlichter in Anspruch nehmen [Name und Kontaktdaten des Schlichters zu vervollständigen].</p>
        <p style="margin-top:18px; font-size:12.5px;"><b>Hinweis:</b> gemäß französischem Recht (LCEN) müssen diese Angaben mit den echten Unternehmensdaten vervollständigt werden, bevor die Website kommerziell veröffentlicht wird.</p>
      `
    }
  }
};

const infoModalOverlay = document.getElementById("infoModalOverlay");
const infoModalBox = document.getElementById("infoModalBox");

function openInfoModal(key){
  const entry = INFO_PAGES[key];
  if(!entry) return;
  const page = entry[LANG] || entry.fr;
  infoModalBox.innerHTML = `
    <div class="modal-close" id="infoModalClose">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </div>
    <h2>${page.title}</h2>
    ${page.html}
  `;
  infoModalOverlay.classList.add("active");
  document.getElementById("infoModalClose").addEventListener("click", closeInfoModal);
}

function closeInfoModal(){
  infoModalOverlay.classList.remove("active");
  infoModalBox.innerHTML = "";
}

infoModalOverlay.addEventListener("click", (e) => {
  if(e.target === infoModalOverlay) closeInfoModal();
});

document.getElementById("linkCGV").addEventListener("click", (e) => { e.preventDefault(); openInfoModal("cgv"); });
document.getElementById("linkRetours").addEventListener("click", (e) => { e.preventDefault(); openInfoModal("retours"); });
document.getElementById("linkConfidentialite").addEventListener("click", (e) => { e.preventDefault(); openInfoModal("confidentialite"); });
document.getElementById("linkMentions").addEventListener("click", (e) => { e.preventDefault(); openInfoModal("mentions"); });

/* Contact par e-mail temporairement indisponible (forte affluence) */
// Message géré via I18N (clé emailUnavailableMsg)
["gmailConfirmLink","gmailContactLink"].forEach(id => {
  document.getElementById(id).addEventListener("click", (e) => {
    e.preventDefault();
    showToast(t("emailUnavailableMsg"), 6000);
  });
});

/* ===================== TOAST ===================== */
function showToast(msg, duration = 3200){
  const wrap = document.getElementById("toastWrap");
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s ease"; setTimeout(()=>t.remove(), 300); }, duration);
}

/* ===================== HERO DIGITAL DISPLAY ANIMATION ===================== */
(function heroDisplay(){
  const tempEl = document.getElementById("heroTemp");
  const captionEl = document.getElementById("heroCaption");
  const modeEl = document.getElementById("heroMode");
  const bars = document.querySelectorAll("#heroBars i");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if(reduceMotion){
    tempEl.textContent = "21";
    captionEl.textContent = "Température intérieure idéale";
    bars.forEach(b => b.classList.add("on"));
    return;
  }

  const sequence = [
    {temp:34, caption:"Température extérieure", mode:"Détection", barsOn:2},
    {temp:29, caption:"Refroidissement en cours", mode:"Refroidissement", barsOn:5},
    {temp:24, caption:"Refroidissement en cours", mode:"Refroidissement", barsOn:8},
    {temp:21, caption:"Température intérieure idéale", mode:"Confort atteint", barsOn:10},
  ];
  let step = 0;

  function paintBars(n){
    bars.forEach((b,i) => b.classList.toggle("on", i < n));
  }

  function tick(){
    const s = sequence[step];
    tempEl.textContent = s.temp;
    captionEl.textContent = s.caption;
    modeEl.textContent = s.mode;
    paintBars(s.barsOn);
    step = (step + 1) % sequence.length;
  }
  tick();
  setInterval(tick, 2200);
})();

/* ===================== SCROLL REVEAL ===================== */
(function reveal(){
  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    els.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  els.forEach(el => io.observe(el));
})();

/* ===================== INIT ===================== */
function reobserveReveal(){
  const els = document.querySelectorAll(".reveal:not(.in)");
  if(!("IntersectionObserver" in window)) { els.forEach(el=>el.classList.add("in")); return; }
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add("in"); io2.unobserve(entry.target);} });
  }, {threshold:0.1});
  els.forEach(el => io2.observe(el));
}

/* ===================== APPLICATION DE LA LANGUE ===================== */
function applyStaticTranslations(){
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    el.innerHTML = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key));
  });
  document.getElementById("langFrBtn").classList.toggle("active", LANG === "fr");
  document.getElementById("langDeBtn").classList.toggle("active", LANG === "de");
}

function setLanguage(lang){
  if(lang !== "fr" && lang !== "de") return;
  LANG = lang;
  try { localStorage.setItem("coinclim_lang", LANG); } catch(e){}
  applyStaticTranslations();
  renderProducts();
  renderReviews();
  renderFaq();
  renderCartView();
  if(modalOverlay.classList.contains("active") && currentModalProductId){
    openModal(currentModalProductId);
  }
}

document.getElementById("langFrBtn").addEventListener("click", () => setLanguage("fr"));
document.getElementById("langDeBtn").addEventListener("click", () => setLanguage("de"));

function init(){
  applyStaticTranslations();
  renderReviews();
  renderFaq();
  renderCartCount();
  renderProducts();
  renderCartView(); // refresh cart line items maintenant que PRODUCTS est chargé
  reobserveReveal();
}
init();
