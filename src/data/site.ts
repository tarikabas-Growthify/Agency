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
  title: 'Agence IA et growth marketing à Paris | Growthify',
  description:
    "Growthify accélère la croissance des PME et startups avec des agents IA sur mesure, l'automatisation et le growth marketing. Agence à Paris, audit offert.",
  email: 'management@growthify.fr',
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
    title: 'IA et automatisation',
    text: "Des agents IA qui prennent en charge vos tâches répétitives et répondent à vos clients 24 h/24.",
  },
  {
    title: 'Growth marketing',
    text: "Une stratégie d'acquisition testée et mesurée pour attirer et convertir les bons clients.",
  },
  {
    title: 'Développement',
    text: 'Sites web et applications mobiles rapides, pensés pour convertir.',
  },
];

export const strengths = [
  'Agents IA sur mesure, connectés à vos outils',
  'Stratégies growth pilotées par la donnée',
  'Sites et applications optimisés pour le SEO et la conversion',
  'Outils modernes : Claude, GPT, n8n, Shopify, Webflow…',
  'Un seul partenaire, de la stratégie à la mise en production',
];

export const faq = [
  {
    q: 'Que fait une agence IA et growth marketing ?',
    a: "Growthify aide les entreprises à grandir sur deux leviers : l'intelligence artificielle (agents IA sur mesure, automatisation de vos processus) et le growth marketing (stratégie d'acquisition, conversion, fidélisation). Nous développons aussi les sites web et applications mobiles qui les rendent possibles.",
  },
  {
    q: "Comment l'IA peut-elle aider mon entreprise à grandir ?",
    a: "Un agent IA peut répondre à vos clients 24 h/24, qualifier vos prospects, préparer vos devis ou mettre à jour votre CRM. Vos équipes gagnent du temps sur les tâches répétitives et se concentrent sur la vente et la relation client.",
  },
  {
    q: 'Travaillez-vous avec les PME ou seulement avec les startups ?',
    a: "Avec les deux. Nous accompagnons des PME, des e-commerçants, des SaaS et des startups, en adaptant chaque projet à la taille, au budget et aux outils de l'entreprise.",
  },
  {
    q: 'Par où commencer ?',
    a: "Par un audit offert : nous analysons votre activité, repérons les meilleures opportunités (IA, acquisition, site) et vous proposons un plan d'action priorisé, sans engagement.",
  },
  {
    q: 'Proposez-vous un suivi après le lancement ?',
    a: "Oui. Maintenance de vos outils, amélioration de vos agents IA, suivi de vos campagnes et de votre référencement : nous restons à vos côtés pour faire évoluer ce qui a été mis en place.",
  },
];
