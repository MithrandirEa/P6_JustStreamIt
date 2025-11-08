/**
 * MODAL WINDOWS - PAGE MODALE
 * Script pour la page modalWindows.html
 * Utilise l'architecture modulaire avec modalHandler et apiService
 */

/**
 * Initialisation de la page modale
 * Point d'entrée principal qui coordonne le chargement du film
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Vérification que tous les modules nécessaires sont chargés
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
 * Gestionnaire pour le bouton fermer X (mobile/tablet)
 * Remplace l'onclick inline pour respecter les standards W3C
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