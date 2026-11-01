// Données générales du site : à modifier ici, elles sont reprises sur toutes les pages.
import cindy from '../assets/images/testimonials/cindy.jpg';
import khadija from '../assets/images/testimonials/khadija.jpg';
import raphael from '../assets/images/team/raphael.jpg';
import khawla from '../assets/images/team/khawla.jpg';
import emeric from '../assets/images/team/emeric.jpg';
import garnier from '../assets/images/clients/garnier.png';
import carven from '../assets/images/clients/carven.png';
import tf1 from '../assets/images/clients/tf1.png';
import mariner from '../assets/images/clients/mariner.png';
import enchant from '../assets/images/clients/enchant.png';

export const site = {
  name: 'Growthify',
  url: 'https://www.growthify.fr',
  title: 'Growthify : agence digitale à Paris | Boostez votre acquisition client',
  description:
    "Growthify est l'agence digitale qui booste votre visibilité en ligne. Nous fusionnons développement web, SEO et growth marketing pour attirer et convertir des clients. Audit gratuit.",
  email: 'contact@growthify.fr',
  phone: '+33 6 34 38 90 46',
  phoneHref: 'tel:+33634389046',
  calendly: 'https://calendly.com/tarik-abas-growthify/30min',
  osUrl: 'https://os.growthify.fr',
  address: {
    street: '295 Rue du Professeur Paul Milliez',
    postalCode: '94500',
    city: 'Champigny-sur-Marne',
    region: 'Île-de-France',
    country: 'FR',
  },
  socials: {
    linkedin: 'https://www.linkedin.com/company/growthify-io/',
    instagram: 'https://www.instagram.com/growthify_digitalagency/',
  },
  legal: {
    company: 'GROWTHIFY',
    form: 'SAS',
    rcs: 'RCS de Créteil 988 547 790',
    vat: 'FR11988547790',
  },
};

// Chiffres clés affichés sur l'accueil et la page À propos.
export const stats = [
  { value: 8, suffix: '', label: "années d'expérience" },
  { value: 160, suffix: '+', label: 'projets réussis' },
  { value: 7, suffix: '', label: 'experts dédiés' },
];

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Réalisations', href: '/projects' },
  { label: 'À propos', href: '/about-us' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact-us' },
];

export const clients = [
  { name: 'Garnier', logo: garnier },
  { name: 'TF1', logo: tf1 },
  { name: 'Carven', logo: carven },
  { name: 'Mariner', logo: mariner },
  { name: 'Enchant', logo: enchant },
];

export const testimonials = [
  {
    quote:
      "Nous avons fait appel à Growthify pour la refonte complète de notre e-commerce. Le processus a été incroyablement fluide : ils nous ont d'abord présenté une maquette Figma très aboutie, à la fois moderne, épurée et parfaitement alignée sur notre brief. L'équipe a ensuite monté la boutique Shopify en respectant le design à la lettre.",
    name: 'Cindy Lee',
    role: 'Atelier Hanami',
    photo: cindy,
  },
  {
    quote:
      "En tant que média numérique, nous avions besoin d'un site à la fois très épuré et très design pour mettre en valeur nos articles. Ils nous ont livré un excellent CMS qui rend la gestion de nos articles d'une simplicité enfantine. Nos journalistes sont ravis et notre site n'a jamais été aussi beau et professionnel.",
    name: 'Khadija Sabil',
    role: 'Directrice, Siyaq.ma',
    photo: khadija,
  },
  {
    quote:
      "Nous voulions un design ultra-moderne qui nous démarque de la concurrence, et ils ont dépassé nos attentes. Le nouveau site est superbe, très premium, et beaucoup plus simple à naviguer pour nos clients. Nous avons vu un impact direct sur les conversions. Un grand merci !",
    name: 'Solène Lafont',
    role: "Solene's Candle",
    photo: null,
  },
];

export const team = [
  { name: 'Raphael A.', role: 'Tech Lead', photo: raphael },
  { name: 'Khawla S.', role: 'Spécialiste marketing digital', photo: khawla },
  { name: 'Emeric R.', role: 'Expert CRO et UX e-commerce', photo: emeric },
];

export const pillars = [
  {
    title: 'Développement',
    text: 'Un code propre et performant : Shopify, Webflow, WordPress ou sur-mesure.',
  },
  {
    title: 'Design et conversion',
    text: "Une UX qui guide l'utilisateur vers l'action, testée et mesurée.",
  },
  {
    title: 'Acquisition',
    text: 'Un SEO solide et un growth marketing ambitieux pour attirer les bons clients.',
  },
];

export const strengths = [
  "Design d'interfaces modernes",
  'Sites et applications optimisés pour le SEO et l’ASO',
  'Expertise des outils modernes (Shopify, Webflow, Figma…)',
  'Approche growth pensée pour la croissance de votre business',
  'Intégration IA adaptée à votre produit (API et agents)',
];

export const faq = [
  {
    q: 'Quels services propose votre agence digitale ?',
    a: "Growthify est une agence digitale spécialisée dans la croissance. Nous proposons le développement web (Webflow, WordPress, Shopify, sur-mesure), le design UX/UI, le SEO et la stratégie de visibilité, l'optimisation de la conversion (CRO), et le branding. Chaque service est conçu pour transformer votre site en machine de croissance, pas en simple vitrine.",
  },
  {
    q: 'Comment allez-vous nous aider à développer notre activité ?',
    a: "Nous combinons développement web, SEO, UX/UI et CRO. Le développement assure un site rapide, fiable et évolutif. Le SEO attire un trafic qualifié. L'UX/UI transforme ce trafic en prospects grâce à une expérience fluide et rassurante. Le CRO maximise vos ventes en optimisant chaque étape à partir de données réelles. Chaque action est mesurée, testée et orientée ROI.",
  },
  {
    q: 'Combien de temps dure un projet SEO ?',
    a: "Le SEO est une stratégie de long terme. En général, les premières améliorations apparaissent entre 6 et 12 semaines, les résultats solides entre 3 et 6 mois, et la croissance durable s'installe après 6 à 12 mois. Nous lançons des actions techniques, éditoriales et structurelles dès le premier mois pour accélérer le retour sur investissement.",
  },
  {
    q: 'Proposez-vous la maintenance et l’évolution de sites web ?',
    a: "Oui. Growthify peut prendre en charge la maintenance technique (sécurité, mises à jour, sauvegardes), l'amélioration continue (nouvelles sections et pages, performance), le suivi SEO et l'optimisation UX/CRO. Notre objectif : faire évoluer votre site au rythme de votre croissance.",
  },
  {
    q: 'Créez-vous des sites sur-mesure ou utilisez-vous des templates ?',
    a: "Les deux, selon vos besoins. Pour une identité forte et unique, nous créons un design 100 % sur-mesure. Pour optimiser votre budget, nous pouvons partir d'un template premium entièrement personnalisé. Dans tous les cas, l'objectif reste le même : un site rapide, moderne et construit pour convertir.",
  },
];
