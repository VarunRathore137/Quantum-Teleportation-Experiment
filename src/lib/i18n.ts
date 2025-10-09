// Internationalization utilities for Quantum Teleportation app

import { useUIStore } from '@/state/ui';

/**
 * Translation keys for the application
 */
export type TranslationKey = 
  | 'nav.tour'
  | 'nav.explorer' 
  | 'nav.researcher'
  | 'nav.home'
  | 'nav.help'
  | 'nav.settings'
  | 'hero.title'
  | 'hero.subtitle'
  | 'hero.description'
  | 'cta.startTour'
  | 'cta.openExplorer'
  | 'cta.researcherMode'
  | 'timeline.setup'
  | 'timeline.entangle'
  | 'timeline.prepare'
  | 'timeline.measure'
  | 'timeline.communicate'
  | 'timeline.reconstruct'
  | 'timeline.verify'
  | 'controls.play'
  | 'controls.pause'
  | 'controls.reset'
  | 'controls.stepForward'
  | 'controls.stepBackward'
  | 'controls.speed'
  | 'legend.title'
  | 'legend.entanglement'
  | 'legend.measurement'
  | 'legend.classicalBits'
  | 'legend.qubitStates'
  | 'legend.circuitGates'
  | 'glossary.title'
  | 'glossary.search'
  | 'glossary.showTechnical'
  | 'settings.title'
  | 'settings.appearance'
  | 'settings.language'
  | 'settings.accessibility'
  | 'settings.performance'
  | 'settings.reducedMotion'
  | 'settings.highContrast'
  | 'settings.screenReader'
  | 'data.states'
  | 'data.circuit'
  | 'data.probability'
  | 'data.measurement'
  | 'error.loading'
  | 'error.notFound'
  | 'error.generic'
  | 'quantum.entanglement'
  | 'quantum.superposition'
  | 'quantum.measurement'
  | 'quantum.teleportation';

/**
 * Translation dictionaries for supported languages
 */
const translations: Record<string, Record<TranslationKey, string>> = {
  en: {
    // Navigation
    'nav.tour': 'Tour',
    'nav.explorer': 'Explorer',
    'nav.researcher': 'Researcher',
    'nav.home': 'Home',
    'nav.help': 'Help',
    'nav.settings': 'Settings',

    // Hero section
    'hero.title': 'Quantum Teleportation, Reimagined',
    'hero.subtitle': 'Quantum Computing Visualization',
    'hero.description': 'A cinematic, interactive lab for every mind—from student to researcher. Experience quantum mechanics like never before.',

    // Call-to-action buttons
    'cta.startTour': 'Start Guided Tour',
    'cta.openExplorer': 'Open Explorer',
    'cta.researcherMode': 'Researcher Mode',

    // Timeline phases
    'timeline.setup': 'Setup',
    'timeline.entangle': 'Entangle',
    'timeline.prepare': 'Prepare',
    'timeline.measure': 'Measure',
    'timeline.communicate': 'Communicate',
    'timeline.reconstruct': 'Reconstruct',
    'timeline.verify': 'Verify',

    // Controls
    'controls.play': 'Play',
    'controls.pause': 'Pause',
    'controls.reset': 'Reset',
    'controls.stepForward': 'Step Forward',
    'controls.stepBackward': 'Step Backward',
    'controls.speed': 'Speed',

    // Legend
    'legend.title': 'Visualization Legend',
    'legend.entanglement': 'Entanglement Link',
    'legend.measurement': 'Measurement Burst',
    'legend.classicalBits': 'Classical Bits',
    'legend.qubitStates': 'Qubit States',
    'legend.circuitGates': 'Circuit Gates',

    // Glossary
    'glossary.title': 'Quantum Glossary',
    'glossary.search': 'Search terms...',
    'glossary.showTechnical': 'Show technical definitions',

    // Settings
    'settings.title': 'Quantum Lab Settings',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.accessibility': 'Accessibility',
    'settings.performance': 'Performance',
    'settings.reducedMotion': 'Reduced Motion',
    'settings.highContrast': 'High Contrast Mode',
    'settings.screenReader': 'Screen Reader Support',

    // Data panels
    'data.states': 'Qubit States',
    'data.circuit': 'Circuit',
    'data.probability': 'Probability',
    'data.measurement': 'Measurement',

    // Error messages
    'error.loading': 'Loading failed. Please try again.',
    'error.notFound': 'Page not found.',
    'error.generic': 'An error occurred. Please refresh the page.',

    // Quantum terms
    'quantum.entanglement': 'Quantum Entanglement',
    'quantum.superposition': 'Superposition',
    'quantum.measurement': 'Quantum Measurement',
    'quantum.teleportation': 'Quantum Teleportation',
  },

  es: {
    // Navigation
    'nav.tour': 'Tour',
    'nav.explorer': 'Explorador',
    'nav.researcher': 'Investigador',
    'nav.home': 'Inicio',
    'nav.help': 'Ayuda',
    'nav.settings': 'Configuración',

    // Hero section
    'hero.title': 'Teletransportación Cuántica, Reimaginada',
    'hero.subtitle': 'Visualización de Computación Cuántica',
    'hero.description': 'Un laboratorio interactivo y cinematográfico para todas las mentes—desde estudiante hasta investigador.',

    // Call-to-action buttons
    'cta.startTour': 'Comenzar Tour Guiado',
    'cta.openExplorer': 'Abrir Explorador',
    'cta.researcherMode': 'Modo Investigador',

    // Timeline phases
    'timeline.setup': 'Configuración',
    'timeline.entangle': 'Entrelazar',
    'timeline.prepare': 'Preparar',
    'timeline.measure': 'Medir',
    'timeline.communicate': 'Comunicar',
    'timeline.reconstruct': 'Reconstruir',
    'timeline.verify': 'Verificar',

    // Controls
    'controls.play': 'Reproducir',
    'controls.pause': 'Pausar',
    'controls.reset': 'Reiniciar',
    'controls.stepForward': 'Paso Adelante',
    'controls.stepBackward': 'Paso Atrás',
    'controls.speed': 'Velocidad',

    // Legend
    'legend.title': 'Leyenda de Visualización',
    'legend.entanglement': 'Enlace de Entrelazamiento',
    'legend.measurement': 'Explosión de Medición',
    'legend.classicalBits': 'Bits Clásicos',
    'legend.qubitStates': 'Estados de Qubit',
    'legend.circuitGates': 'Puertas de Circuito',

    // Glossary
    'glossary.title': 'Glosario Cuántico',
    'glossary.search': 'Buscar términos...',
    'glossary.showTechnical': 'Mostrar definiciones técnicas',

    // Settings
    'settings.title': 'Configuración del Laboratorio Cuántico',
    'settings.appearance': 'Apariencia',
    'settings.language': 'Idioma',
    'settings.accessibility': 'Accesibilidad',
    'settings.performance': 'Rendimiento',
    'settings.reducedMotion': 'Movimiento Reducido',
    'settings.highContrast': 'Modo Alto Contraste',
    'settings.screenReader': 'Soporte de Lector de Pantalla',

    // Data panels
    'data.states': 'Estados de Qubit',
    'data.circuit': 'Circuito',
    'data.probability': 'Probabilidad',
    'data.measurement': 'Medición',

    // Error messages
    'error.loading': 'Error de carga. Inténtalo de nuevo.',
    'error.notFound': 'Página no encontrada.',
    'error.generic': 'Ocurrió un error. Actualiza la página.',

    // Quantum terms
    'quantum.entanglement': 'Entrelazamiento Cuántico',
    'quantum.superposition': 'Superposición',
    'quantum.measurement': 'Medición Cuántica',
    'quantum.teleportation': 'Teletransportación Cuántica',
  },

  fr: {
    // Navigation
    'nav.tour': 'Visite',
    'nav.explorer': 'Explorateur',
    'nav.researcher': 'Chercheur',
    'nav.home': 'Accueil',
    'nav.help': 'Aide',
    'nav.settings': 'Paramètres',

    // Hero section
    'hero.title': 'Téléportation Quantique, Réinventée',
    'hero.subtitle': 'Visualisation de l\'Informatique Quantique',
    'hero.description': 'Un laboratoire interactif et cinématographique pour tous les esprits—d\'étudiant à chercheur.',

    // Call-to-action buttons
    'cta.startTour': 'Commencer la Visite Guidée',
    'cta.openExplorer': 'Ouvrir l\'Explorateur',
    'cta.researcherMode': 'Mode Chercheur',

    // Timeline phases
    'timeline.setup': 'Configuration',
    'timeline.entangle': 'Intrication',
    'timeline.prepare': 'Préparer',
    'timeline.measure': 'Mesurer',
    'timeline.communicate': 'Communiquer',
    'timeline.reconstruct': 'Reconstruire',
    'timeline.verify': 'Vérifier',

    // Controls
    'controls.play': 'Lecture',
    'controls.pause': 'Pause',
    'controls.reset': 'Réinitialiser',
    'controls.stepForward': 'Étape Suivante',
    'controls.stepBackward': 'Étape Précédente',
    'controls.speed': 'Vitesse',

    // Legend
    'legend.title': 'Légende de Visualisation',
    'legend.entanglement': 'Lien d\'Intrication',
    'legend.measurement': 'Explosion de Mesure',
    'legend.classicalBits': 'Bits Classiques',
    'legend.qubitStates': 'États de Qubit',
    'legend.circuitGates': 'Portes de Circuit',

    // Glossary
    'glossary.title': 'Glossaire Quantique',
    'glossary.search': 'Rechercher des termes...',
    'glossary.showTechnical': 'Afficher les définitions techniques',

    // Settings
    'settings.title': 'Paramètres du Laboratoire Quantique',
    'settings.appearance': 'Apparence',
    'settings.language': 'Langue',
    'settings.accessibility': 'Accessibilité',
    'settings.performance': 'Performance',
    'settings.reducedMotion': 'Mouvement Réduit',
    'settings.highContrast': 'Mode Haut Contraste',
    'settings.screenReader': 'Support de Lecteur d\'Écran',

    // Data panels
    'data.states': 'États de Qubit',
    'data.circuit': 'Circuit',
    'data.probability': 'Probabilité',
    'data.measurement': 'Mesure',

    // Error messages
    'error.loading': 'Échec du chargement. Veuillez réessayer.',
    'error.notFound': 'Page non trouvée.',
    'error.generic': 'Une erreur s\'est produite. Veuillez actualiser la page.',

    // Quantum terms
    'quantum.entanglement': 'Intrication Quantique',
    'quantum.superposition': 'Superposition',
    'quantum.measurement': 'Mesure Quantique',
    'quantum.teleportation': 'Téléportation Quantique',
  }
};

/**
 * Translation hook
 */
export const useTranslation = () => {
  const language = useUIStore(state => state.language);
  
  const t = (key: TranslationKey, fallback?: string): string => {
    const translation = translations[language]?.[key] || translations.en[key];
    return translation || fallback || key;
  };

  const formatMessage = (key: TranslationKey, params: Record<string, string | number> = {}): string => {
    let message = t(key);
    
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(new RegExp(`{${param}}`, 'g'), String(value));
    });
    
    return message;
  };

  return {
    t,
    formatMessage,
    language,
    isLanguageSupported: (lang: string) => lang in translations,
    getSupportedLanguages: () => Object.keys(translations),
  };
};

/**
 * Language detection utilities
 */
export const LanguageUtils = {
  /**
   * Detect browser language
   */
  detectBrowserLanguage(): string {
    if (typeof navigator === 'undefined') return 'en';
    
    const language = navigator.language || 'en';
    const shortLang = language.split('-')[0];
    
    return translations[shortLang] ? shortLang : 'en';
  },

  /**
   * Get language direction (for future RTL support)
   */
  getLanguageDirection(lang: string): 'ltr' | 'rtl' {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
  },

  /**
   * Format number according to locale
   */
  formatNumber(number: number, lang: string, options?: Intl.NumberFormatOptions): string {
    if (typeof Intl === 'undefined') return number.toString();
    
    try {
      return new Intl.NumberFormat(lang, options).format(number);
    } catch {
      return number.toString();
    }
  },

  /**
   * Format percentage
   */
  formatPercentage(value: number, lang: string): string {
    return this.formatNumber(value, lang, { 
      style: 'percent', 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    });
  }
};

/**
 * Get available languages with metadata
 */
export const getLanguageOptions = () => [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

/**
 * Initialize i18n system
 */
export const initI18n = () => {
  const detectedLanguage = LanguageUtils.detectBrowserLanguage();
  const storedLanguage = localStorage.getItem('quantum-lab-language');
  
  const initialLanguage = storedLanguage && translations[storedLanguage] 
    ? storedLanguage 
    : detectedLanguage;
  
  // Set initial language in store
  useUIStore.getState().setLanguage(initialLanguage);
  
  // Set HTML lang attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = LanguageUtils.getLanguageDirection(initialLanguage);
  }
};