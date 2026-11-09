// course.js
import { saveQuizScore } from './supabase-config.js';

// Liste des questions du quiz
const quizData = [
    {
        question: "Quel mot-clé permet de déclarer une méthode virtuelle pure en C++ ?",
        options: [
            { text: "A) virtual void Afficher();", correct: false },
            { text: "B) virtual void Afficher() = 0;", correct: true },
            { text: "C) pure void Afficher();", correct: false },
            { text: "D) abstract void Afficher();", correct: false }
        ]
    },
    {
        question: "Quel conteneur de la bibliothèque standard C++ garantit un accès direct en temps constant O(1) ?",
        options: [
            { text: "A) std::list", correct: false },
            { text: "B) std::map", correct: false },
            { text: "C) std::vector", correct: true },
            { text: "D) std::set", correct: false }
        ]
    },
    {
        question: "En programmation web, quel attribut HTML permet de lier un script en tant que module ES6 ?",
        options: [
            { text: "A) type='module'", correct: true },
            { text: "B) rel='script'", correct: false },
            { text: "C) async='true'", correct: false },
            { text: "D) mode='es6'", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let totalScore = 0;

document.addEventListener('DOMContentLoaded', () => {
    let savedUser = localStorage.getItem('wiska_user');
    if (!savedUser) {
        const defaultUser = { name: "Kadia" };
        localStorage.setItem('wiska_user', JSON.stringify(defaultUser));
        savedUser = JSON.stringify(defaultUser);
    }

    const userData = JSON.parse(savedUser);
    const userName = userData.name || userData.username || "Membre Wiska";

    loadQuestion();

    function loadQuestion() {
        const container = document.querySelector('.space-y-4');
        if (!container) return;

        if (currentQuestionIndex >= quizData.length) {
            container.innerHTML = `
                <div class="text-center space-y-3 p-6 bg-slate-800 rounded-2xl">
                    <h3 class="text-xl font-bold text-blue-400">Quiz Terminé ! 🎉</h3>
                    <p class="text-sm text-slate-200">Votre score final : <span class="font-bold text-green-400">${totalScore}</span> / ${quizData.length * 10}</p>
                    <button id="restart-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Recommencer</button>
                </div>
            `;
            
            saveQuizScore(userName, totalScore);

            document.getElementById('restart-btn').addEventListener('click', () => {
                currentQuestionIndex = 0;
                totalScore = 0;
                location.reload();
            });
            return;
        }

        const q = quizData[currentQuestionIndex];

        container.innerHTML = `
            <div class="flex justify-between items-center text-xs text-blue-400 font-bold mb-2">
                <span>Question ${currentQuestionIndex + 1} sur ${quizData.length}</span>
                <span>Score : ${totalScore} pts</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-300 font-semibold">${q.question}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="options-grid"></div>
            <div id="quiz-result" class="hidden p-3 rounded-xl text-xs text-center font-bold mt-3"></div>
            <button id="next-btn" class="hidden w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Question Suivante ➡️</button>
        `;

        const grid = document.getElementById('options-grid');
        
        // Correction de la méthode pour parcourir les options
        q.options.forEach((opt) => {
            const btn = document.createElement('button');
            btn.className = "quiz-option p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-left border border-slate-700 font-medium transition cursor-pointer";
            btn.textContent = opt.text;
            btn.dataset.correct = opt.correct;

            btn.addEventListener('click', () => handleAnswer(btn, opt.correct));
            grid.appendChild(btn);
        });
    }

    function handleAnswer(selectedBtn, isCorrect) {
        const allButtons = document.querySelectorAll('.quiz-option');
        allButtons.forEach(b => b.disabled = true);

        const resultBox = document.getElementById('quiz-result');
        const nextBtn = document.getElementById('next-btn');

        resultBox.classList.remove('hidden', 'bg-blue-500/20', 'text-blue-400', 'bg-red-500/20', 'text-red-400');

        if (isCorrect) {
            selectedBtn.classList.add('bg-green-600/30', 'border-green-500');
            resultBox.classList.add('bg-blue-500/20', 'text-blue-400');
            resultBox.innerHTML = 'Bravo ! Bonne réponse.';
            totalScore += 10;
        } else {
            selectedBtn.classList.add('bg-red-600/30', 'border-red-500');
            resultBox.classList.add('bg-red-500/20', 'text-red-400');
            resultBox.innerHTML = 'Mauvaise réponse.';
        }

        if (nextBtn) {
            nextBtn.classList.remove('hidden');
            nextBtn.onclick = () => {
                currentQuestionIndex++;
                loadQuestion();
            };
        }
    }
});