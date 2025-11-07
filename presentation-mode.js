/**
 * SCRIPT DE MASQUAGE DES ERREURS POUR PRÉSENTATION
 * 
 * Ce script intercepte et masque tous les types d'erreurs qui peuvent apparaître
 * dans la console du navigateur pendant une présentation professionnelle.
 */

(function() {
    'use strict';
    
    // Sauvegarder les fonctions console originales
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Mode présentation : masquer les erreurs de console
    const PRESENTATION_MODE = true;
    
    if (PRESENTATION_MODE) {
        // Remplacer console.error pour filtrer les erreurs d'images
        console.error = function(...args) {
            const message = args[0] || '';
            
            // Filtrer les erreurs liées aux images et CORS
            if (typeof message === 'string') {
                if (message.includes('Failed to load resource') ||
                    message.includes('Access to fetch') ||
                    message.includes('CORS') ||
                    message.includes('blocked by CORS') ||
                    message.includes('OpaqueResponseBlocking') ||
                    message.includes('net::ERR_FAILED') ||
                    message.includes('404') ||
                    message.includes('403')) {
                    // Log silencieusement sans afficher
                    return;
                }
            }
            
            // Afficher les autres erreurs importantes
            originalConsoleError.apply(console, args);
        };
        
        // Remplacer console.warn pour filtrer les avertissements
        console.warn = function(...args) {
            const message = args[0] || '';
            
            if (typeof message === 'string') {
                if (message.includes('resource is blocked') ||
                    message.includes('OpaqueResponseBlocking') ||
                    message.includes('CORS') ||
                    message.includes('Failed to load') ||
                    message.includes('net::ERR')) {
                    // Masquer les avertissements liés aux ressources
                    return;
                }
            }
            
            // Afficher les autres avertissements
            originalConsoleWarn.apply(console, args);
        };
    }
    
    // Intercepter les erreurs réseau globales
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args)
            .catch(error => {
                // Log silencieux des erreurs de fetch
                console.log('🔇 Network request handled gracefully');
                throw error; // Re-throw pour maintenir le comportement
            });
    };
    
    // Masquer les erreurs d'images dans le DOM
    function handleImageErrors() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Image error handled silently
            }, true);
        });
    }
    
    // Observer pour les nouvelles images ajoutées dynamiquement
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG') {
                        node.addEventListener('error', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }, true);
                    }
                    // Check for images in added subtrees
                    const images = node.querySelectorAll && node.querySelectorAll('img');
                    if (images) {
                        images.forEach(img => {
                            img.addEventListener('error', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                            }, true);
                        });
                    }
                }
            });
        });
    });
    
    // Démarrer l'observation quand le DOM est prêt
    document.addEventListener('DOMContentLoaded', function() {
        handleImageErrors();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
    
    console.log('🎭 Mode présentation activé - Erreurs masquées');
})();