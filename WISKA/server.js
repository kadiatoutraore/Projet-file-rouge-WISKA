const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Permet de servir tous vos fichiers HTML, CSS, JS du projet
app.use(express.static(path.join(__dirname)));

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Le serveur Wiska et Supabase sont connectés !' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré avec succès sur http://localhost:${PORT}`);
});