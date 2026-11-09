**1. Lancer l'application**
Le lancement de Wiska a été pensé pour être simple et fluide en environnement local :

Environnement de développement : L'application s'exécute localement à l'aide de Live Server sous VS Code, permettant un rechargement dynamique et rapide à chaque modification.

Architecture des fichiers : Les fichiers du projet ont été organisés à plat à la racine avec des noms en minuscules (index.html, chat.html, courses.html, index.js, chat.js, supabase-config.js) pour éviter toute erreur de chemin ou de casse.

Point d'entrée : L'utilisateur commence sur la page d'accueil (index.html), qui gère l'authentification et l'accès rapide via un mode invité/démo pour basculer instantanément vers la messagerie.

**2. Fonctionnalités principales**
Wiska regroupe des outils complets pour centraliser la communication et l'interaction :

Authentification rapide et sécurisée : Formulaires d'inscription et de connexion validés, avec gestion de sessions locales (localStorage).

Gestion dynamique de la liste de contacts : Un panneau latéral permettant de basculer facilement entre les discussions et les contacts connectés.

Salons thématiques et espaces d'échange : Des canaux publics dédiés (comme # Général ou # Entraide C++) pour structurer les conversations de la classe ou de la communauté.

**3. Autour des messages (Messagerie instantanée)**
Le cœur de la plateforme repose sur des échanges fluides et en temps réel :

Fluidité et ergonomie : Interface de chat moderne inspirée des standards actuels avec distinction visuelle des messages envoyés et reçus.

Horodatage précis : Chaque message affiche l'heure exacte de son envoi.

Temps réel : Grâce à l'intégration de Supabase, les messages s'enregistrent en base de données et se synchronisent instantanément.

**4. Profil et Paramètres**
Gestion du profil utilisateur : Chaque utilisateur dispose d'un avatar et d'un pseudo personnalisable.

Onglet Paramètres : Permet à l'utilisateur de modifier à tout moment ses informations personnelles (comme son pseudo) et de gérer sa session (déconnexion sécurisée).

**5. Fonctionnalités supplémentaires**
Wiska ne se limite pas à une simple messagerie, elle intègre des modules transverses :

Espace Cours & Quiz : Des modules d'apprentissage intégrés (accessibles via courses.html) pour se former au quotidien et tester ses connaissances.

Espace Jeux & Galerie Photo : Des espaces prévus pour briser la glace et partager des médias au sein de la communauté.

**6. Résumé automatique**
Wiska est une plateforme web interactive et collaborative conçue pour l'entraide et l'apprentissage en temps réel. Elle combine un espace de messagerie instantanée fluide, des salons thématiques, des modules de formation et une interface moderne et responsive, le tout propulsé par une base de données cloud performante.

**7. Organisation du code**
Le code source est structuré de manière modulaire et propre :

HTML / Tailwind CSS : Utilisation de classes utilitaires via CDN pour un design moderne, épuré et adaptatif (Dark Mode natif avec des tons ardoise/bleu).

JavaScript Vanilla : Séparation des logiques par page (index.js pour la connexion, chat.js pour la messagerie et les onglets, courses.js pour la partie pédagogique).

Configuration centralisée : Un fichier unique (supabase-config.js) gère la connexion au backend et les fonctions d'écoute en temps réel.

**8. Base de données**
Stockage Cloud (Supabase) : Utilisation de tables relationnelles PostgreSQL (notamment la table messages) pour stocker de manière sécurisée les échanges, les identifiants de salons, les noms et les avatars.

Temps Réel (Realtime) : Activation des abonnements de type postgres_changes sur Supabase pour écouter les insertions (INSERT) et mettre à jour l'interface des utilisateurs instantanément.

9. Technologie utilisée
Frontend : HTML5, JavaScript moderne (ES6+), Tailwind CSS pour l'interface visuelle et FontAwesome pour les icônes.

Backend & Temps Réel : Supabase (client JavaScript officiel via CDN, base de données PostgreSQL et WebSockets pour le temps réel).

Outils de développement : VS Code, Live Server.

Conception et Réalisation : Projet conduit et réalisé par TRAORÉ Kadiatou et Niamba Niamba Irenee Cyrusse.
