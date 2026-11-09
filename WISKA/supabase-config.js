// js/supabase-config.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Vos clés Supabase configurées
const SUPABASE_URL = 'https://losclaeuhuluqpaghusu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Nl8jtmVTiPJueTpMjrslBw_eKjtfPtL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- GESTION DES MESSAGES (Chat) ---

// Envoyer un message dans Supabase
export async function sendWiskaMessage(targetId, text, currentUser, isFile = false) {
    const { error } = await supabase
        .from('messages')
        .insert([
            {
                target_id: targetId,
                sender_name: currentUser.name,
                sender_avatar: currentUser.avatar,
                text: text,
                is_file: isFile
            }
        ]);
    
    if (error) {
        console.error("Erreur lors de l'envoi du message :", error);
    }
}

// Écouter les messages en temps réel
export function listenMessages(targetId, callbackUI) {
    async function fetchMessages() {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('target_id', targetId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            formatAndCallback(data);
        }
    }

    fetchMessages();

    // Abonnement Realtime pour écouter les ajouts instantanément
    supabase
        .channel(`public:messages:target_id=eq.${targetId}`)
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `target_id=eq.${targetId}`
        }, () => {
            fetchMessages();
        })
        .subscribe();

    function formatAndCallback(rawMessages) {
        const currentUser = JSON.parse(localStorage.getItem('wiska_user') || '{}');
        const formatted = rawMessages.map(msg => {
            const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
                sender: msg.sender_name,
                avatar: msg.sender_avatar,
                text: msg.text,
                time: timeStr,
                isFile: msg.is_file || false,
                isSelf: msg.sender_name === currentUser.name
            };
        });
        callbackUI(formatted);
    }
}

// --- GESTION DU QUIZ ---

// Enregistrer le score du quiz dans la table 'scores_qiz'
export async function saveQuizScore(userName, scoreValue) {
    const { data, error } = await supabase
        .from('scores_qiz') // Corrigé ici : correspond exactement à votre table Supabase
        .insert([
            { user_name: userName, score: scoreValue }
        ]);

    if (error) {
        console.error("Erreur lors de l'enregistrement du score du quiz :", error);
        return false;
    } else {
        console.log("Score enregistré avec succès dans Supabase !", data);
        return true;
    }
}