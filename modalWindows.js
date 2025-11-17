/**
 * MODAL WINDOWS - PAGE MODALE
 * Script de gestion de la page modalWindows.html
 * Utilise l'architecture modulaire (modalHandler, apiService, modalTemplate)
 */

/**
 * Initialise la page modale au chargement du DOM
 * Coordonne le chargement des données du film
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Vérification des modules requis
    if (!window.ApiService) {
        console.error('ApiService non disponible');
        return;
    }
    
    if (!window.ModalTemplate) {
        console.error('ModalTemplate non disponible');
        return;
    }
    
    if (!window.ModalHandler) {
        console.error('ModalHandler non disponible');
        return;
    }

    // Initialisation du gestionnaire de modale
    const modalHandler = new window.ModalHandler();
    await modalHandler.initialize();
});

/**
 * Gestionnaire du bouton fermer X (mobile/tablette)
 * Conforme aux standards W3C (sans onclick inline)
 */
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.btn-close-x');
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});