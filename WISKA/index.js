// index.js corrigé
document.addEventListener('DOMContentLoaded', () => {
    console.log("index.js chargé avec succès !");

    const loginForm = document.getElementById('login-form');
    const guestBtn = document.getElementById('btn-guest');

    function saveAndRedirect(name) {
        const finalName = name && name.trim() !== '' ? name.trim() : 'Kadiatou Traoré';
        const userData = {
            name: finalName,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        };

        // Sauvegarde dans le localStorage
        localStorage.setItem('wiska_user', JSON.stringify(userData));
        console.log("Utilisateur sauvegardé, redirection vers chat.html...");

        // Redirection vers la messagerie
        window.location.href = 'chat.html';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Empêche le rechargement de la page
            const usernameInput = document.getElementById('username-input').value;
            saveAndRedirect(usernameInput);
        });
    }

    if (guestBtn) {
        guestBtn.addEventListener('click', (e) => {
            e.preventDefault();
            saveAndRedirect('Kadiatou Traoré (Invité)');
        });
    }
});