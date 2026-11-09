// chat.js - Version Temps Réel Instantané + Gestion Dynamique des Contacts
document.addEventListener('DOMContentLoaded', () => {
    // 1. Vérification de l'utilisateur connecté
    const savedUser = localStorage.getItem('wiska_user');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }
    const currentUser = JSON.parse(savedUser);

    // Injection des infos utilisateur dans le header
    const nameElem = document.getElementById('current-user-name');
    const avatarElem = document.getElementById('current-user-avatar');
    const settingsInput = document.getElementById('settings-username');

    if (nameElem) nameElem.innerText = currentUser.name;
    if (avatarElem) avatarElem.src = currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
    if (settingsInput) settingsInput.value = currentUser.name;

    // 2. Gestion des Onglets (Discussions / Contacts / Paramètres)
    const btnDisc = document.getElementById('tab-btn-discussions');
    const btnCont = document.getElementById('tab-btn-contacts');
    const btnSett = document.getElementById('tab-btn-settings');

    const viewDisc = document.getElementById('side-view-discussions');
    const viewCont = document.getElementById('side-view-contacts');
    const viewSett = document.getElementById('side-view-settings');

    function switchTab(tabName) {
        if (viewDisc) viewDisc.classList.toggle('hidden', tabName !== 'discussions');
        if (viewCont) viewCont.classList.toggle('hidden', tabName !== 'contacts');
        if (viewSett) viewSett.classList.toggle('hidden', tabName !== 'settings');

        if (btnDisc) btnDisc.className = tabName === 'discussions' ? "flex-1 py-3 text-center border-b-2 border-blue-500 text-blue-400 font-bold cursor-pointer" : "flex-1 py-3 text-center text-slate-400 hover:text-slate-200 cursor-pointer";
        if (btnCont) btnCont.className = tabName === 'contacts' ? "flex-1 py-3 text-center border-b-2 border-blue-500 text-blue-400 font-bold cursor-pointer" : "flex-1 py-3 text-center text-slate-400 hover:text-slate-200 cursor-pointer";
        if (btnSett) btnSett.className = tabName === 'settings' ? "flex-1 py-3 text-center border-b-2 border-blue-500 text-blue-400 font-bold cursor-pointer" : "flex-1 py-3 text-center text-slate-400 hover:text-slate-200 cursor-pointer";
    }

    if (btnDisc) btnDisc.addEventListener('click', () => switchTab('discussions'));
    if (btnCont) btnCont.addEventListener('click', () => switchTab('contacts'));
    if (btnSett) btnSett.addEventListener('click', () => switchTab('settings'));

    // 3. Gestion dynamique des contacts et salons
    let activeTargetId = 'room-general';
    let activeTargetName = '# Général';

    // Initialisation des contacts par défaut
    const defaultContacts = [
        { id: 'contact-ousmane', name: 'Ousmane Camara', status: '● En ligne', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
        { id: 'contact-suzie', name: 'Suzie Valentin', status: '● En ligne', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
    ];

    if (!localStorage.getItem('wiska_contacts')) {
        localStorage.setItem('wiska_contacts', JSON.stringify(defaultContacts));
    }

    function renderContactsList() {
        const container = document.getElementById('contacts-list-container');
        if (!container) return;

        const contacts = JSON.parse(localStorage.getItem('wiska_contacts') || '[]');
        container.innerHTML = '';

        contacts.forEach(contact => {
            const div = document.createElement('div');
            div.className = 'chat-target-item p-3 hover:bg-slate-800/80 cursor-pointer flex items-center space-x-3';
            div.dataset.targetId = contact.id;
            div.dataset.targetName = contact.name;
            div.dataset.targetStatus = contact.status || '● Hors ligne';
            div.dataset.targetAvatar = contact.avatar;

            div.innerHTML = `
                <img src="${contact.avatar}" class="w-10 h-10 rounded-full object-cover">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-xs sm:text-sm truncate">${contact.name}</h4>
                    <p class="text-[11px] text-blue-400">${contact.status || '● Hors ligne'}</p>
                </div>
            `;

            container.appendChild(div);
        });

        attachTargetListeners();
    }

    function attachTargetListeners() {
        document.querySelectorAll('.chat-target-item').forEach(item => {
            item.onclick = () => {
                document.querySelectorAll('.chat-target-item').forEach(el => {
                    el.classList.remove('bg-slate-800/50', 'border-l-4', 'border-blue-500');
                });
                item.classList.add('bg-slate-800/50', 'border-l-4', 'border-blue-500');

                activeTargetId = item.dataset.targetId;
                activeTargetName = item.dataset.targetName;

                document.getElementById('active-chat-name').innerText = activeTargetName;
                document.getElementById('active-chat-status').innerText = item.dataset.targetStatus;
                document.getElementById('active-chat-avatar').src = item.dataset.targetAvatar;

                renderMessages();
            };
        });
    }

    // Modal pour créer un contact
    const btnOpenContactModal = document.getElementById('btn-open-create-contact');
    const btnCancelContact = document.getElementById('btn-cancel-contact');
    const btnSaveContact = document.getElementById('btn-save-contact');
    const modalContact = document.getElementById('modal-create-contact');
    const inputContactName = document.getElementById('new-contact-name');

    if (btnOpenContactModal && modalContact) {
        btnOpenContactModal.addEventListener('click', () => {
            modalContact.classList.remove('hidden');
        });
    }

    if (btnCancelContact && modalContact) {
        btnCancelContact.addEventListener('click', () => {
            modalContact.classList.add('hidden');
            if (inputContactName) inputContactName.value = '';
        });
    }

    if (btnSaveContact) {
        btnSaveContact.addEventListener('click', () => {
            const name = inputContactName.value.trim();
            if (!name) return;

            const contacts = JSON.parse(localStorage.getItem('wiska_contacts') || '[]');
            const newContact = {
                id: 'contact-' + Date.now(),
                name: name,
                status: '● En ligne',
                avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
            };

            contacts.push(newContact);
            localStorage.setItem('wiska_contacts', JSON.stringify(contacts));

            modalContact.classList.add('hidden');
            inputContactName.value = '';

            renderContactsList();
        });
    }

    // 4. Envoi et affichage instantané des messages
    const sendBtn = document.getElementById('btn-send-message');
    const textInput = document.getElementById('message-text-input');
    const messagesBox = document.getElementById('messages-box');

    function handleSend() {
        const text = textInput.value.trim();
        if (!text) return;

        const newMessage = {
            targetId: activeTargetId,
            sender: currentUser.name,
            avatar: currentUser.avatar,
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        let messages = JSON.parse(localStorage.getItem('wiska_all_messages') || '[]');
        messages.push(newMessage);
        localStorage.setItem('wiska_all_messages', JSON.stringify(messages));

        textInput.value = '';
        renderMessages();
    }

    function renderMessages() {
        if (!messagesBox) return;
        messagesBox.innerHTML = `<div class="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs text-center">Conversation avec <b>${activeTargetName}</b></div>`;

        let messages = JSON.parse(localStorage.getItem('wiska_all_messages') || '[]');
        const filtered = messages.filter(m => m.targetId === activeTargetId);

        filtered.forEach(msg => {
            const isSelf = msg.sender === currentUser.name;
            const div = document.createElement('div');
            div.className = `flex items-start space-x-2.5 ${isSelf ? 'justify-end' : ''}`;
            div.innerHTML = isSelf ? `
                <div class="bg-blue-600 text-white p-3 rounded-2xl shadow-md max-w-md text-xs">
                    <p>${msg.text}</p>
                    <span class="text-[9px] text-blue-200 mt-1 block text-right">${msg.time}</span>
                </div>
                <img src="${msg.avatar}" class="w-7 h-7 rounded-full object-cover">
            ` : `
                <img src="${msg.avatar}" class="w-7 h-7 rounded-full object-cover">
                <div class="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-md max-w-md text-xs">
                    <span class="font-bold text-blue-400 text-[11px] block mb-0.5">${msg.sender}</span>
                    <p class="text-slate-200">${msg.text}</p>
                    <span class="text-[9px] text-slate-500 mt-1 block">${msg.time}</span>
                </div>
            `;
            messagesBox.appendChild(div);
        });
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // Synchronisation inter-onglets
    window.addEventListener('storage', (e) => {
        if (e.key === 'wiska_all_messages') {
            renderMessages();
        } else if (e.key === 'wiska_contacts') {
            renderContactsList();
        }
    });

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (textInput) {
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // 5. Paramètres et Déconnexion
    const saveSettingsBtn = document.getElementById('btn-save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const newName = settingsInput.value.trim();
            if (newName) {
                currentUser.name = newName;
                localStorage.setItem('wiska_user', JSON.stringify(currentUser));
                if (nameElem) nameElem.innerText = newName;
                alert('Pseudo mis à jour avec succès !');
            }
        });
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('wiska_user');
            window.location.href = 'index.html';
        });
    }

    // Initialisation au chargement
    renderContactsList();
    attachTargetListeners();
    renderMessages();
});