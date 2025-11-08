/**
 * RESPONSIVE UTILITIES
 * Gestion de la responsivite et des breakpoints
 * Calcule le nombre de films a afficher selon la taille d'ecran
 */

/**
 * Configuration des breakpoints responsive
 * Definit les seuils d'ecran selon les specifications du projet
 */
const RESPONSIVE_CONFIG = {
    breakpoints: {
        mobile: { max: 767, pageSize: 2 },      // 1 colonne x 2 films empiles
        tablet: { min: 768, max: 991, pageSize: 4 }, // 2 colonnes x 2 lignes  
        desktop: { min: 992, pageSize: 6 }      // 3 colonnes x 2 lignes
    }
};

/**
 * Determine le nombre de films a afficher selon la taille d'ecran
 * Fonction principale qui adapte le contenu selon les specifications responsive
 * @returns {number} Nombre de films adaptes a l'ecran (2, 4 ou 6)
 */
function getPageSize() {
    const width = window.innerWidth;
    let pageSize;
    
    if (width >= RESPONSIVE_CONFIG.breakpoints.desktop.min) {
        pageSize = RESPONSIVE_CONFIG.breakpoints.desktop.pageSize;
        console.log(`Mode PC detecte (${width}px) - ${pageSize} films en grille 3x2`);
    } else if (width >= RESPONSIVE_CONFIG.breakpoints.tablet.min) {
        pageSize = RESPONSIVE_CONFIG.breakpoints.tablet.pageSize;
        console.log(`Mode Tablette detecte (${width}px) - ${pageSize} films en grille 2x2`);
    } else {
        pageSize = RESPONSIVE_CONFIG.breakpoints.mobile.pageSize;
        console.log(`Mode Mobile detecte (${width}px) - ${pageSize} films empiles verticalement`);
    }
    
    return pageSize;
}

/**
 * Determine le type de device actuel
 * Identifie le type d'appareil selon la largeur d'ecran
 * @returns {string} 'mobile', 'tablet', ou 'desktop'
 */
function getDeviceType() {
    const width = window.innerWidth;
    
    if (width >= RESPONSIVE_CONFIG.breakpoints.desktop.min) {
        return 'desktop';
    } else if (width >= RESPONSIVE_CONFIG.breakpoints.tablet.min) {
        return 'tablet';
    } else {
        return 'mobile';
    }
}

/**
 * Verifie si on est en mode mobile
 * Fonction utilitaire pour les conditions responsive
 * @returns {boolean} true si mobile (largeur < 768px)
 */
function isMobile() {
    return getDeviceType() === 'mobile';
}

/**
 * Verifie si on est en mode desktop
 * Fonction utilitaire pour les conditions responsive
 * @returns {boolean} true si desktop (largeur >= 992px)
 */
function isDesktop() {
    return getDeviceType() === 'desktop';
}

// Export pour utilisation dans script.js via l'objet window
// Expose les fonctions de gestion responsive
if (typeof window !== 'undefined') {
    window.ResponsiveUtils = {
        getPageSize,
        getDeviceType,
        isMobile,
        isDesktop,
        RESPONSIVE_CONFIG
    };
}