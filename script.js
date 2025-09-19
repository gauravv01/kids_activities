// Kids Math Games - Interactive JavaScript Functionality

// Global game state
let currentGame = 'number-grid';
let score = 0;
let streak = 0;
let selectedMatches = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeGameNavigation();
    initializeNumberGrid();
    initializeCommaGame();
    initializeAbacusGame();
    initializeGreatestSmallest();
    initializeMatching();
    initializeDigitBags();
    initializeShapeMatching();
    initializeHelicopterColoring();
    initializeShapeProperties();
    initializeShapeAnalysis();
    initializeObjectProperties();
    updateScore();
});

// Game Navigation System
function initializeGameNavigation() {
    const gameButtons = document.querySelectorAll('.game-btn');
    const gameContainers = document.querySelectorAll('.game-container');

    gameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetGame = this.getAttribute('data-game');
            
            // Update active button
            gameButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target game container
            gameContainers.forEach(container => {
                container.classList.remove('active');
            });
            
            const targetContainer = document.getElementById(targetGame);
            if (targetContainer) {
                targetContainer.classList.add('active');
                currentGame = targetGame;
            }
        });
    });
}

// Number Grid Game (6,559 to 6,604 pattern)
function initializeNumberGrid() {
    const gridCells = document.querySelectorAll('#number-grid .grid-cell:not(.given):not(.blue-pattern)');
    const correctAnswers = {
        2: '6,560', 4: '6,562', 6: '6,565',
        8: '6,569', 10: '6,571', 12: '6,574', 14: '6,576',
        16: '6,579', 18: '6,582', 20: '6,585',
        24: '6,589', 26: '6,591', 28: '6,594',
        32: '6,598', 34: '6,601', 36: '6,603',
        40: '6,607', 42: '6,609', 44: '6,612', 46: '6,614'
    };

    gridCells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
            if (!this.classList.contains('filled')) {
                const userInput = prompt('Enter the number for this cell:');
                if (userInput) {
                    this.textContent = userInput;
                    this.classList.add('filled');
                    
                    // Store the answer for checking
                    this.dataset.userAnswer = userInput;
                }
            }
        });
    });
}

function checkGridAnswer() {
    const filledCells = document.querySelectorAll('#number-grid .grid-cell.filled');
    const correctAnswers = ['6,560', '6,562', '6,565', '6,569', '6,571', '6,574', '6,576', '6,579', '6,582', '6,585', '6,589', '6,591', '6,594', '6,598', '6,601', '6,603', '6,607', '6,609', '6,612', '6,614'];
    
    let correct = 0;
    let total = filledCells.length;
    
    filledCells.forEach(cell => {
        const userAnswer = cell.textContent.trim();
        if (correctAnswers.includes(userAnswer)) {
            correct++;
            cell.style.backgroundColor = '#4CAF50';
            cell.style.color = 'white';
        } else {
            cell.style.backgroundColor = '#f44336';
            cell.style.color = 'white';
        }
    });
    
    showFeedback('grid-feedback', correct, total);
    updateScore(correct === total ? 10 : 0);
}

function resetGridGame() {
    const filledCells = document.querySelectorAll('#number-grid .grid-cell.filled');
    filledCells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('filled');
        cell.style.backgroundColor = '';
        cell.style.color = '';
        delete cell.dataset.userAnswer;
    });
    clearFeedback('grid-feedback');
}

// Comma and Birds Game
function initializeCommaGame() {
    const inputs = document.querySelectorAll('#comma-birds .number-input');
    inputs.forEach(input => {
        let isProcessing = false;
        
        input.addEventListener('input', function(e) {
            if (isProcessing) return;
            
            isProcessing = true;
            const cursorPosition = this.selectionStart;
            let value = this.value;
            
            // Remove any non-digit, non-comma characters
            value = value.replace(/[^0-9,]/g, '');
            
            // Remove multiple commas and ensure only one comma
            const parts = value.split(',');
            if (parts.length > 2) {
                // If more than one comma, keep only the first one
                value = parts[0] + ',' + parts.slice(1).join('');
            }
            
            // Auto-format: if user typed 4 digits without comma, add comma after first digit
            if (!value.includes(',') && value.length === 4) {
                value = value.charAt(0) + ',' + value.slice(1);
            }
            
            // Limit to 5 characters total (X,XXX format)
            if (value.length > 5) {
                value = value.substring(0, 5);
            }
            
            this.value = value;
            
            // Restore cursor position
            let newCursorPosition = cursorPosition;
            if (value.length !== this.value.length) {
                newCursorPosition = Math.min(cursorPosition, value.length);
            }
            this.setSelectionRange(newCursorPosition, newCursorPosition);
            
            isProcessing = false;
        });
        
        // Allow proper key handling
        input.addEventListener('keydown', function(e) {
            // Allow: backspace, delete, tab, escape, enter, home, end, left, right
            if ([8, 9, 27, 13, 35, 36, 37, 39, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.ctrlKey && [65, 67, 86, 88].indexOf(e.keyCode) !== -1)) {
                return;
            }
            
            // Allow comma key
            if (e.keyCode === 188 || e.keyCode === 44) {
                // Only allow comma if there isn't one already
                if (this.value.includes(',')) {
                    e.preventDefault();
                }
                return;
            }
            
            // Allow numbers (0-9)
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                return;
            }
            
            // Block everything else
            e.preventDefault();
        });
    });
}

function checkCommaGame() {
    const inputs = document.querySelectorAll('#comma-birds .number-input');
    let correct = 0;
    
    inputs.forEach(input => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.answer;
        
        if (userAnswer === correctAnswer) {
            correct++;
            input.style.backgroundColor = '#4CAF50';
            input.style.color = 'white';
        } else {
            input.style.backgroundColor = '#f44336';
            input.style.color = 'white';
        }
    });
    
    showFeedback('comma-feedback', correct, inputs.length);
    updateScore(correct === inputs.length ? 10 : 0);
}

function resetCommaGame() {
    const inputs = document.querySelectorAll('#comma-birds .number-input');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.color = '';
    });
    clearFeedback('comma-feedback');
}

// Abacus Game
function initializeAbacusGame() {
    // Beads are already set up in HTML, just need to handle number name inputs
    const inputs = document.querySelectorAll('#abacus-game .number-name-input input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toLowerCase();
        });
    });
}

function checkAbacusGame() {
    const inputs = document.querySelectorAll('#abacus-game .number-name-input input');
    let correct = 0;
    
    inputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.dataset.answer.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            correct++;
            input.style.backgroundColor = '#4CAF50';
            input.style.color = 'white';
        } else {
            input.style.backgroundColor = '#f44336';
            input.style.color = 'white';
        }
    });
    
    showFeedback('abacus-feedback', correct, inputs.length);
    updateScore(correct === inputs.length ? 15 : 0);
}

function resetAbacusGame() {
    const inputs = document.querySelectorAll('#abacus-game .number-name-input input');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.color = '';
    });
    clearFeedback('abacus-feedback');
}

// Greatest and Smallest Numbers Game
function initializeGreatestSmallest() {
    const digitInputs = document.querySelectorAll('#greatest-smallest .digit-input');
    
    digitInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Only allow single digits
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 1);
        });
    });
}

function checkGreatestSmallest() {
    const digitSets = document.querySelectorAll('#greatest-smallest .digit-set');
    const correctAnswers = [
        { greatest: '5421', smallest: '1245' }, // 4,5,2,1
        { greatest: '4310', smallest: '1034' }, // 0,3,1,4
        { greatest: '8640', smallest: '4068' }  // 8,4,6,0
    ];
    
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    digitSets.forEach((set, setIndex) => {
        const answerSections = set.querySelectorAll('.answer-section');
        const greatestInputs = answerSections[0].querySelectorAll('.digit-input');
        const smallestInputs = answerSections[1].querySelectorAll('.digit-input');
        
        // Check greatest
        const greatestAnswer = Array.from(greatestInputs).map(input => input.value).join('');
        const smallestAnswer = Array.from(smallestInputs).map(input => input.value).join('');
        
        totalQuestions += 2;
        
        if (greatestAnswer === correctAnswers[setIndex].greatest) {
            totalCorrect++;
            greatestInputs.forEach(input => {
                input.style.backgroundColor = '#4CAF50';
                input.style.color = 'white';
            });
        } else {
            greatestInputs.forEach(input => {
                input.style.backgroundColor = '#f44336';
                input.style.color = 'white';
            });
        }
        
        if (smallestAnswer === correctAnswers[setIndex].smallest) {
            totalCorrect++;
            smallestInputs.forEach(input => {
                input.style.backgroundColor = '#4CAF50';
                input.style.color = 'white';
            });
        } else {
            smallestInputs.forEach(input => {
                input.style.backgroundColor = '#f44336';
                input.style.color = 'white';
            });
        }
    });
    
    showFeedback('greatest-smallest-feedback', totalCorrect, totalQuestions);
    updateScore(totalCorrect === totalQuestions ? 20 : 0);
}

function resetGreatestSmallest() {
    const inputs = document.querySelectorAll('#greatest-smallest .digit-input');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.color = '';
    });
    clearFeedback('greatest-smallest-feedback');
}

// Number Word Matching Game
function initializeMatching() {
    const matchingContainer = document.querySelector('.matching-container');
    const numberItems = document.querySelectorAll('#number-word-match .number-item');
    const wordItems = document.querySelectorAll('#number-word-match .word-item');
    
    // Create SVG for drawing lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
    matchingContainer.style.position = 'relative';
    matchingContainer.appendChild(svg);
    
    numberItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedMatches = selectedMatches.filter(match => match.number !== this);
            } else {
                // Clear other selections
                numberItems.forEach(num => num.classList.remove('selected'));
                this.classList.add('selected');
                
                // Store selection
                const existingMatch = selectedMatches.find(match => match.number === this);
                if (!existingMatch) {
                    selectedMatches.push({ number: this, word: null });
                }
            }
        });
    });
    
    wordItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedNumber = document.querySelector('#number-word-match .number-item.selected');
            if (selectedNumber) {
                // Create match
                const matchIndex = selectedMatches.findIndex(match => match.number === selectedNumber);
                if (matchIndex !== -1) {
                    selectedMatches[matchIndex].word = this;
                    
                    // Visual feedback
                    selectedNumber.classList.remove('selected');
                    selectedNumber.classList.add('matched');
                    this.classList.add('matched');
                    
                    // Draw line between matched items
                    drawLine(selectedNumber, this, svg);
                }
            }
        });
    });
}

function drawLine(fromElement, toElement, svg) {
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    const containerRect = svg.parentElement.getBoundingClientRect();
    
    const fromX = fromRect.right - containerRect.left;
    const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
    const toX = toRect.left - containerRect.left;
    const toY = toRect.top + toRect.height / 2 - containerRect.top;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromX);
    line.setAttribute('y1', fromY);
    line.setAttribute('x2', toX);
    line.setAttribute('y2', toY);
    line.setAttribute('stroke', '#4a90e2');
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');
    line.classList.add('match-line');
    
    svg.appendChild(line);
}

function checkMatching() {
    let correct = 0;
    
    selectedMatches.forEach(match => {
        if (match.number && match.word) {
            const numberValue = match.number.dataset.value;
            const wordValue = match.word.dataset.value;
            
            if (numberValue === wordValue) {
                correct++;
                match.number.style.backgroundColor = '#4CAF50';
                match.word.style.backgroundColor = '#4CAF50';
                match.number.style.color = 'white';
                match.word.style.color = 'white';
            } else {
                match.number.style.backgroundColor = '#f44336';
                match.word.style.backgroundColor = '#f44336';
                match.number.style.color = 'white';
                match.word.style.color = 'white';
            }
        }
    });
    
    showFeedback('matching-feedback', correct, 4);
    updateScore(correct === 4 ? 15 : 0);
}

function resetMatching() {
    selectedMatches = [];
    const items = document.querySelectorAll('#number-word-match .match-item');
    items.forEach(item => {
        item.classList.remove('selected', 'matched');
        item.style.backgroundColor = '';
        item.style.color = '';
    });
    
    // Clear all drawn lines
    const lines = document.querySelectorAll('#number-word-match .match-line');
    lines.forEach(line => line.remove());
    
    clearFeedback('matching-feedback');
}

// Digit Bags Game
function initializeDigitBags() {
    const inputs = document.querySelectorAll('#digit-bags .answer-input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Only allow 4-digit numbers
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4);
        });
    });
}

function checkDigitBags() {
    const inputs = document.querySelectorAll('#digit-bags .answer-input');
    let correct = 0;
    
    inputs.forEach(input => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.answer;
        
        if (userAnswer === correctAnswer) {
            correct++;
            input.style.backgroundColor = '#4CAF50';
            input.style.color = 'white';
        } else {
            input.style.backgroundColor = '#f44336';
            input.style.color = 'white';
        }
    });
    
    showFeedback('digit-bags-feedback', correct, inputs.length);
    updateScore(correct === inputs.length ? 15 : 0);
}

function resetDigitBags() {
    const inputs = document.querySelectorAll('#digit-bags .answer-input');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.color = '';
    });
    clearFeedback('digit-bags-feedback');
}

// Utility Functions
function showFeedback(feedbackId, correct, total) {
    const feedback = document.getElementById(feedbackId);
    const percentage = Math.round((correct / total) * 100);
    
    if (correct === total) {
        feedback.textContent = `🎉 Perfect! You got all ${total} answers correct!`;
        feedback.className = 'feedback correct';
        createCelebrationEffect();
        streak++;
    } else {
        feedback.textContent = `You got ${correct} out of ${total} correct (${percentage}%). Keep trying!`;
        feedback.className = 'feedback incorrect';
        streak = 0;
    }
}

function clearFeedback(feedbackId) {
    const feedback = document.getElementById(feedbackId);
    feedback.textContent = '';
    feedback.className = 'feedback';
}

function updateScore(points = 0) {
    if (points > 0) {
        score += points;
        if (streak > 1) {
            score += streak; // Bonus for streaks
        }
    }
    
    document.getElementById('total-score').textContent = score;
    document.getElementById('streak-count').textContent = streak;
}

function createCelebrationEffect() {
    // Play crazy celebration sound and amazing voice with sound effects
    playCelebrationSound();
    setTimeout(() => playVoiceWithSoundEffects(), 300);
    
    // Create main celebration container
    const celebrationContainer = document.createElement('div');
    celebrationContainer.className = 'celebration-container';
    document.body.appendChild(celebrationContainer);
    
    // Add crazy celebration message with multiple animations
    const message = document.createElement('div');
    message.className = 'celebration-message';
    const crazyMessages = [
        '🎉 WOOOHOOO! 🎉',
        '🌟 AMAZING! 🌟', 
        '🚀 SUPERSTAR! 🚀',
        '🎊 INCREDIBLE! 🎊',
        '⭐ FANTASTIC! ⭐',
        '🏆 CHAMPION! 🏆',
        '💎 BRILLIANT! 💎',
        '🎪 SPECTACULAR! 🎪'
    ];
    const randomMessage = crazyMessages[Math.floor(Math.random() * crazyMessages.length)];
    
    message.innerHTML = `
        <div class="celebration-text crazy-bounce">${randomMessage}</div>
        <div class="celebration-subtext rainbow-text">Perfect Score!</div>
        <div class="celebration-points pulse-glow">+${streak > 1 ? '20' : '15'} Points!</div>
        <div class="celebration-extra">🏆 YOU'RE THE BEST! 🏆</div>
    `;
    celebrationContainer.appendChild(message);
    
    // Create multiple screen effects
    createCrazyScreenEffects();
    
    // Create massive confetti explosion
    createMegaConfetti(celebrationContainer);
    
    // Create floating crazy emojis
    createCrazyFloatingEmojis(celebrationContainer);
    
    // Create multiple fireworks
    createMegaFireworks(celebrationContainer);
    
    // Create dancing rainbow
    createDancingRainbow(celebrationContainer);
    
    // Create explosive particle burst
    createExplosiveParticleBurst(celebrationContainer);
    
    // Create bouncing stars
    createBouncingStars(celebrationContainer);
    
    // Create spinning shapes
    createSpinningShapes(celebrationContainer);
    
    // Create floating balloons
    createFloatingBalloons(celebrationContainer);
    
    // Remove everything after longer animation
    setTimeout(() => {
        celebrationContainer.remove();
    }, 7000);
}

function createScreenFlash() {
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
    }, 300);
}

function createCrazyScreenEffects() {
    // Multiple screen flashes with different colors
    const colors = ['rgba(255,255,255,0.8)', 'rgba(255,215,0,0.6)', 'rgba(255,20,147,0.6)', 'rgba(0,255,255,0.6)'];
    
    colors.forEach((color, index) => {
        setTimeout(() => {
            const flash = document.createElement('div');
            flash.className = 'crazy-screen-flash';
            flash.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
            document.body.appendChild(flash);
            
            setTimeout(() => flash.remove(), 400);
        }, index * 200);
    });
    
    // Screen shake effect
    document.body.style.animation = 'screenShake 0.8s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 800);
}

function createMegaConfetti(container) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
    const shapes = ['▲', '●', '■', '♦', '★', '♥', '♠', '♣', '◆', '▼', '◀', '▶'];
    
    // Create 100 confetti pieces (double the original)
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'mega-confetti-piece';
            confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 4 + 3) + 's';
            confetti.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            container.appendChild(confetti);
        }, i * 30);
    }
}

function createCrazyFloatingEmojis(container) {
    const emojis = ['🎊', '🎉', '🌟', '✨', '🎈', '🎁', '🏆', '👏', '🥳', '💫', '🎪', '🎭', '🎨', '🎯', '🎲', '🎸', '🎺', '🥇', '🏅', '💎'];
    
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'crazy-floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.animationDelay = Math.random() * 2 + 's';
            emoji.style.fontSize = (Math.random() * 3 + 2) + 'rem';
            container.appendChild(emoji);
        }, i * 80);
    }
}

function createMegaFireworks(container) {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'mega-firework';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * (window.innerHeight / 2) + 'px';
            container.appendChild(firework);
            
            // Create more explosion particles
            for (let j = 0; j < 20; j++) {
                const particle = document.createElement('div');
                particle.className = 'mega-firework-particle';
                particle.style.transform = `rotate(${j * 18}deg)`;
                particle.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
                firework.appendChild(particle);
            }
        }, i * 200);
    }
}

function createDancingRainbow(container) {
    const rainbow = document.createElement('div');
    rainbow.className = 'dancing-rainbow';
    container.appendChild(rainbow);
    
    // Add multiple rainbow layers for crazy effect
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const extraRainbow = document.createElement('div');
            extraRainbow.className = 'dancing-rainbow-layer';
            extraRainbow.style.animationDelay = i * 0.5 + 's';
            container.appendChild(extraRainbow);
        }, i * 300);
    }
}

function createExplosiveParticleBurst(container) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Create multiple bursts
    for (let burst = 0; burst < 5; burst++) {
        setTimeout(() => {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'explosive-particle';
                particle.style.left = centerX + 'px';
                particle.style.top = centerY + 'px';
                
                const angle = (i / 50) * Math.PI * 2;
                const distance = 150 + Math.random() * 300;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;
                
                particle.style.setProperty('--end-x', endX + 'px');
                particle.style.setProperty('--end-y', endY + 'px');
                particle.style.animationDelay = Math.random() * 0.5 + 's';
                particle.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
                
                container.appendChild(particle);
            }
        }, burst * 400);
    }
}

function createBouncingStars(container) {
    const stars = ['⭐', '🌟', '✨', '💫', '🌠'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'bouncing-star';
            star.textContent = stars[Math.floor(Math.random() * stars.length)];
            star.style.left = Math.random() * window.innerWidth + 'px';
            star.style.animationDelay = Math.random() * 2 + 's';
            star.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
            container.appendChild(star);
        }, i * 100);
    }
}

function createSpinningShapes(container) {
    const shapes = ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠', '⚫', '⚪', '🔶', '🔷', '🔸', '🔹'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const shape = document.createElement('div');
            shape.className = 'spinning-shape';
            shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            shape.style.left = Math.random() * window.innerWidth + 'px';
            shape.style.top = Math.random() * window.innerHeight + 'px';
            shape.style.animationDelay = Math.random() * 3 + 's';
            shape.style.fontSize = (Math.random() * 3 + 2) + 'rem';
            container.appendChild(shape);
        }, i * 150);
    }
}

function createFloatingBalloons(container) {
    const balloons = ['🎈', '🎈', '🎈', '🎈', '🎈'];
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'floating-balloon';
            balloon.textContent = balloons[i % balloons.length];
            balloon.style.left = Math.random() * window.innerWidth + 'px';
            balloon.style.color = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.animationDelay = Math.random() * 1 + 's';
            balloon.style.fontSize = (Math.random() * 2 + 2) + 'rem';
            container.appendChild(balloon);
        }, i * 200);
    }
}

function createParticleBurst(container) {
    // Legacy function - keeping for compatibility
    createExplosiveParticleBurst(container);
}

function createConfetti(container) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const shapes = ['▲', '●', '■', '♦', '★', '♥'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(confetti);
        }, i * 50);
    }
}

function createFloatingEmojis(container) {
    const emojis = ['🎊', '🎉', '🌟', '✨', '🎈', '🎁', '🏆', '👏', '🥳', '💫'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.animationDelay = Math.random() * 1 + 's';
            container.appendChild(emoji);
        }, i * 100);
    }
}

function createFireworks(container) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * (window.innerHeight / 2) + 'px';
            container.appendChild(firework);
            
            // Create explosion particles
            for (let j = 0; j < 12; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.transform = `rotate(${j * 30}deg)`;
                firework.appendChild(particle);
            }
        }, i * 300);
    }
}

function createRainbowEffect(container) {
    const rainbow = document.createElement('div');
    rainbow.className = 'rainbow-effect';
    container.appendChild(rainbow);
}

// Enhanced Sound Effects using Web Audio API
function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playErrorSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Lower frequency
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playCelebrationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a celebration melody
        const notes = [
            { freq: 523.25, time: 0 },    // C5
            { freq: 659.25, time: 0.2 },  // E5
            { freq: 783.99, time: 0.4 },  // G5
            { freq: 1046.5, time: 0.6 },  // C6
            { freq: 783.99, time: 0.8 },  // G5
            { freq: 1046.5, time: 1.0 }   // C6
        ];
        
        notes.forEach(note => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
                oscillator.type = 'triangle'; // Warmer sound
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            }, note.time * 1000);
        });
        
        // Add some sparkle sounds
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(1500 + Math.random() * 1000, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            }, Math.random() * 2000);
        }
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playKidsVictoryVoice() {
    // Create multiple exciting voice announcements with different styles
    if ('speechSynthesis' in window) {
        // First announcement - Super excited
        setTimeout(() => playExcitedVoice(), 100);
        
        // Second announcement - Encouraging  
        setTimeout(() => playEncouragingVoice(), 2000);
        
        // Third announcement - Celebration
        setTimeout(() => playCelebrationVoice(), 3500);
    }
}

function playExcitedVoice() {
    const excitedPhrases = [
        "WOOOOOHOOOOO! That was absolutely AMAZING!",
        "YAAAAAAY! You're so FANTASTIC!",
        "WOW WOW WOW! That was INCREDIBLE!",
        "OH MY GOSH! You got it PERFECT!",
        "HOORAY HOORAY! You're BRILLIANT!",
        "SUPER DUPER AWESOME! Way to go!",
        "SPECTACULAR! You're a ROCKSTAR!",
        "OUTSTANDING! You nailed it!"
    ];
    
    const phrase = excitedPhrases[Math.floor(Math.random() * excitedPhrases.length)];
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    // Super excited settings - more kid-friendly
    utterance.rate = 1.2; // Slightly slower so kids can understand
    utterance.pitch = 1.7; // Very high pitch for excitement
    utterance.volume = 1.0;
    
    // Add emphasis and pauses for better delivery
    utterance.text = phrase.replace(/!/g, '! '); // Add pauses after exclamations
    
    selectBestVoice(utterance, speechSynthesis.getVoices());
    speechSynthesis.speak(utterance);
}

function playEncouragingVoice() {
    const encouragingPhrases = [
        "You are absolutely INCREDIBLE! Your brain is super smart!",
        "You're a SUPERSTAR! Math is your superpower!",
        "What an AMAZING job! You're getting better and better!",
        "You're a true CHAMPION! I believe in you!",
        "FANTASTIC work! You make learning look so easy!",
        "You're a MATH WIZARD! Your skills are magical!",
        "BRILLIANT thinking! You're so clever!",
        "AWESOME sauce! You're the coolest!"
    ];
    
    const phrase = encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    // Encouraging settings - warm and supportive
    utterance.rate = 1.0; // Slower for warmth
    utterance.pitch = 1.6; // High but not too high
    utterance.volume = 0.95;
    
    // Add pauses for better delivery
    utterance.text = phrase.replace(/!/g, '! ');
    
    selectBestVoice(utterance, speechSynthesis.getVoices());
    speechSynthesis.speak(utterance);
}

function playCelebrationVoice() {
    const celebrationPhrases = [
        "Let's PARTY! You deserve a big celebration! Dance time!",
        "HIGH FIVE! You're the COOLEST kid ever! So proud!",
        "VICTORY DANCE! You're absolutely AMAZING! Keep going!",
        "CELEBRATION TIME! You're a shining STAR! Woohoo!",
        "PARTY PARTY! You ROCK this game! You're the best!",
        "HAPPY DANCE! You're UNSTOPPABLE! So so proud!",
        "FIREWORKS TIME! You're SPECTACULAR! Amazing job!",
        "CONFETTI PARTY! You're BRILLIANT! Keep shining!"
    ];
    
    const phrase = celebrationPhrases[Math.floor(Math.random() * celebrationPhrases.length)];
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    // Celebration settings - fun and energetic
    utterance.rate = 1.1;
    utterance.pitch = 1.5; // Fun but clear
    utterance.volume = 1.0;
    
    // Add pauses and emphasis
    utterance.text = phrase.replace(/!/g, '! ').replace(/PARTY/g, 'PAR-TY');
    
    selectBestVoice(utterance, speechSynthesis.getVoices());
    speechSynthesis.speak(utterance);
}

function selectBestVoice(utterance, voices) {
    // Enhanced priority order for the most kid-friendly voices
    const preferredVoiceNames = [
        // High-quality kid-friendly voices
        'Samantha', 'Karen', 'Victoria', 'Allison', 'Susan', 'Zoe', 'Tessa', 'Kathy',
        'Princess', 'Alice', 'Amelie', 'Anna', 'Ellen', 'Fiona', 'Moira',
        // Google voices (usually high quality)
        'Google UK English Female', 'Google US English Female', 'Google français',
        // Microsoft voices
        'Microsoft Zira', 'Microsoft Hazel', 'Microsoft Eva', 'Microsoft Aria',
        // System voices
        'Female', 'en-US Female', 'en-GB Female', 'en-AU Female'
    ];
    
    // Try to find the best voice
    for (const preferredName of preferredVoiceNames) {
        const voice = voices.find(v => 
            v.name.includes(preferredName) || 
            v.name.toLowerCase().includes(preferredName.toLowerCase())
        );
        if (voice) {
            utterance.voice = voice;
            console.log('Selected voice:', voice.name);
            return;
        }
    }
    
    // Fallback: find any female voice
    const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.gender === 'female' ||
        voice.name.toLowerCase().includes('girl')
    );
    
    if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('Using female fallback voice:', femaleVoice.name);
    } else {
        console.log('Using default system voice');
    }
}

// Add fun sound effects before voice announcements
function playVoiceWithSoundEffects() {
    // Play a fun "ding" sound before voice
    playChimeSound();
    
    // Then play the voice after a short delay
    setTimeout(() => playKidsVictoryVoice(), 200);
}

function playChimeSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a pleasant chime sound
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G chord
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.8);
            }, index * 100);
        });
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Add sound effects to feedback
const originalShowFeedback = showFeedback;
showFeedback = function(feedbackId, correct, total) {
    originalShowFeedback(feedbackId, correct, total);
    
    if (correct === total) {
        playSuccessSound();
    } else {
        playErrorSound();
    }
};

// Keyboard shortcuts - only when not typing in inputs
document.addEventListener('keydown', function(e) {
    // Don't trigger shortcuts if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    if (e.key >= '1' && e.key <= '6') {
        const gameIndex = parseInt(e.key) - 1;
        const gameButtons = document.querySelectorAll('.game-btn');
        if (gameButtons[gameIndex]) {
            gameButtons[gameIndex].click();
        }
    }
});

// Auto-save progress to localStorage
function saveProgress() {
    localStorage.setItem('kidsMatGameProgress', JSON.stringify({
        score: score,
        streak: streak,
        currentGame: currentGame
    }));
}

function loadProgress() {
    const saved = localStorage.getItem('kidsMatGameProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        score = progress.score || 0;
        streak = progress.streak || 0;
        currentGame = progress.currentGame || 'number-grid';
        updateScore();
        
        // Switch to saved game
        const targetButton = document.querySelector(`[data-game="${currentGame}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

// Load progress on startup
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
});

// Save progress periodically
setInterval(saveProgress, 30000); // Save every 30 seconds

// Shape Games Implementation

// Shape Matching Game (Bears)
let shapeMatches = [];

function initializeShapeMatching() {
    const shapeNames = document.querySelectorAll('#shape-matching .shape-name-item');
    const shapeObjects = document.querySelectorAll('#shape-matching .shape-object-item');
    
    // Create SVG for drawing lines
    const matchingContainer = document.querySelector('.bear-matching-container');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
    matchingContainer.appendChild(svg);
    
    shapeNames.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                shapeMatches = shapeMatches.filter(match => match.name !== this);
            } else {
                shapeNames.forEach(name => name.classList.remove('selected'));
                this.classList.add('selected');
                
                const existingMatch = shapeMatches.find(match => match.name === this);
                if (!existingMatch) {
                    shapeMatches.push({ name: this, object: null });
                }
            }
        });
    });
    
    shapeObjects.forEach(item => {
        item.addEventListener('click', function() {
            const selectedName = document.querySelector('#shape-matching .shape-name-item.selected');
            if (selectedName) {
                const matchIndex = shapeMatches.findIndex(match => match.name === selectedName);
                if (matchIndex !== -1) {
                    shapeMatches[matchIndex].object = this;
                    
                    selectedName.classList.remove('selected');
                    selectedName.classList.add('matched');
                    this.classList.add('matched');
                    
                    drawShapeLine(selectedName, this, svg);
                }
            }
        });
    });
}

function drawShapeLine(fromElement, toElement, svg) {
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    const containerRect = svg.parentElement.getBoundingClientRect();
    
    const fromX = fromRect.right - containerRect.left;
    const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
    const toX = toRect.left - containerRect.left;
    const toY = toRect.top + toRect.height / 2 - containerRect.top;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromX);
    line.setAttribute('y1', fromY);
    line.setAttribute('x2', toX);
    line.setAttribute('y2', toY);
    line.setAttribute('stroke', '#e17055');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.classList.add('shape-match-line');
    
    svg.appendChild(line);
}

function checkShapeMatching() {
    let correct = 0;
    
    shapeMatches.forEach(match => {
        if (match.name && match.object) {
            const nameValue = match.name.dataset.value;
            const objectValue = match.object.dataset.value;
            
            if (nameValue === objectValue) {
                correct++;
                match.name.style.backgroundColor = '#4CAF50';
                match.object.style.backgroundColor = '#4CAF50';
            } else {
                match.name.style.backgroundColor = '#f44336';
                match.object.style.backgroundColor = '#f44336';
            }
        }
    });
    
    showFeedback('shape-matching-feedback', correct, 5);
    updateScore(correct === 5 ? 20 : 0);
}

function resetShapeMatching() {
    shapeMatches = [];
    const items = document.querySelectorAll('#shape-matching .shape-name-item, #shape-matching .shape-object-item');
    items.forEach(item => {
        item.classList.remove('selected', 'matched');
        item.style.backgroundColor = '';
    });
    
    const lines = document.querySelectorAll('#shape-matching .shape-match-line');
    lines.forEach(line => line.remove());
    
    clearFeedback('shape-matching-feedback');
}

// Helicopter Coloring Game
let selectedColor = null;
const colorMap = {
    triangle: 'pink',
    rectangle: 'blue', 
    circle: 'yellow',
    oval: 'red',
    square: 'green'
};

function initializeHelicopterColoring() {
    const colorBtns = document.querySelectorAll('#helicopter-coloring .color-btn');
    const shapes = document.querySelectorAll('#helicopter-coloring .colorable-shape');
    
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            colorBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedColor = this.dataset.color;
        });
    });
    
    shapes.forEach(shape => {
        shape.addEventListener('click', function() {
            if (selectedColor) {
                const colorValue = getColorValue(selectedColor);
                this.setAttribute('fill', colorValue);
            }
        });
    });
}

function getColorValue(colorName) {
    const colors = {
        pink: '#ff69b4',
        blue: '#4169e1',
        yellow: '#ffd700',
        red: '#ff4444',
        green: '#32cd32'
    };
    return colors[colorName] || '#ffffff';
}

function checkHelicopterColoring() {
    const shapes = document.querySelectorAll('#helicopter-coloring .colorable-shape');
    let correct = 0;
    
    shapes.forEach(shape => {
        const shapeType = shape.dataset.shape;
        const expectedColor = colorMap[shapeType];
        const actualColor = shape.getAttribute('fill');
        const expectedColorValue = getColorValue(expectedColor);
        
        if (actualColor === expectedColorValue) {
            correct++;
            shape.setAttribute('stroke', '#4CAF50');
            shape.setAttribute('stroke-width', '4');
        } else {
            shape.setAttribute('stroke', '#f44336');
            shape.setAttribute('stroke-width', '4');
        }
    });
    
    showFeedback('helicopter-feedback', correct, shapes.length);
    updateScore(correct === shapes.length ? 15 : 0);
}

function resetHelicopterColoring() {
    const shapes = document.querySelectorAll('#helicopter-coloring .colorable-shape');
    shapes.forEach(shape => {
        shape.setAttribute('fill', 'white');
        shape.setAttribute('stroke', 'black');
        shape.setAttribute('stroke-width', '2');
    });
    
    const colorBtns = document.querySelectorAll('#helicopter-coloring .color-btn');
    colorBtns.forEach(btn => btn.classList.remove('selected'));
    selectedColor = null;
    
    clearFeedback('helicopter-feedback');
}

// Shape Properties Game
function initializeShapeProperties() {
    // No special initialization needed, just form elements
}

function checkShapeProperties() {
    let correct = 0;
    let total = 0;
    
    // Check checkboxes
    const checkboxes = document.querySelectorAll('#shape-properties .shape-checkbox');
    checkboxes.forEach(checkbox => {
        total++;
        const expectedAnswer = checkbox.dataset.answer === 'true';
        if (checkbox.checked === expectedAnswer) {
            correct++;
            checkbox.parentElement.style.backgroundColor = '#4CAF50';
        } else {
            checkbox.parentElement.style.backgroundColor = '#f44336';
        }
    });
    
    // Check example inputs
    const exampleInputs = document.querySelectorAll('#shape-properties .example-input');
    exampleInputs.forEach(input => {
        total++;
        const userAnswer = input.value.toLowerCase().trim();
        const acceptableAnswers = input.dataset.answer.split(',');
        
        if (acceptableAnswers.some(answer => userAnswer.includes(answer.trim()))) {
            correct++;
            input.style.backgroundColor = '#4CAF50';
            input.style.color = 'white';
        } else {
            input.style.backgroundColor = '#f44336';
            input.style.color = 'white';
        }
    });
    
    // Check radio buttons
    const selectedRadio = document.querySelector('#shape-properties input[name="not-circle"]:checked');
    total++;
    if (selectedRadio && selectedRadio.dataset.correct === 'true') {
        correct++;
        selectedRadio.parentElement.style.backgroundColor = '#4CAF50';
    } else if (selectedRadio) {
        selectedRadio.parentElement.style.backgroundColor = '#f44336';
    }
    
    showFeedback('shape-properties-feedback', correct, total);
    updateScore(correct === total ? 25 : 0);
}

function resetShapeProperties() {
    const checkboxes = document.querySelectorAll('#shape-properties .shape-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.parentElement.style.backgroundColor = '';
    });
    
    const inputs = document.querySelectorAll('#shape-properties .example-input');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.color = '';
    });
    
    const radios = document.querySelectorAll('#shape-properties input[name="not-circle"]');
    radios.forEach(radio => {
        radio.checked = false;
        radio.parentElement.style.backgroundColor = '';
    });
    
    clearFeedback('shape-properties-feedback');
}

// Shape Analysis Game
function initializeShapeAnalysis() {
    const traceShapes = document.querySelectorAll('#shape-analysis .trace-shape');
    
    traceShapes.forEach(shape => {
        shape.addEventListener('click', function() {
            const object = this.dataset.object;
            const siblings = document.querySelectorAll(`[data-object="${object}"]`);
            
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function checkShapeAnalysis() {
    let correct = 0;
    let total = 0;
    
    // Check analysis inputs
    const analysisInputs = document.querySelectorAll('#shape-analysis .analysis-input');
    analysisInputs.forEach(input => {
        total++;
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.answer;
        
        if (userAnswer === correctAnswer) {
            correct++;
            input.style.backgroundColor = '#4CAF50';
            input.style.color = 'white';
        } else {
            input.style.backgroundColor = '#f44336';
            input.style.color = 'white';
        }
    });
    
    // Check tracing selections
    const tracingAnswers = {
        'box': 'square',
        'orange': 'circle', 
        'cube': 'square',
        'clock': 'circle',
        'brick': 'rectangle'
    };
    
    Object.keys(tracingAnswers).forEach(objectType => {
        total++;
        const selectedShape = document.querySelector(`#shape-analysis .trace-shape[data-object="${objectType}"].selected`);
        if (selectedShape && selectedShape.dataset.shape === tracingAnswers[objectType]) {
            correct++;
            selectedShape.style.backgroundColor = '#4CAF50';
        } else if (selectedShape) {
            selectedShape.style.backgroundColor = '#f44336';
        }
    });
    
    showFeedback('shape-analysis-feedback', correct, total);
    updateScore(correct === total ? 20 : 0);
}

function resetShapeAnalysis() {
    const inputs = document.querySelectorAll('#shape-analysis .analysis-input');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.color = '';
    });
    
    const traceShapes = document.querySelectorAll('#shape-analysis .trace-shape');
    traceShapes.forEach(shape => {
        shape.classList.remove('selected');
        shape.style.backgroundColor = '';
    });
    
    clearFeedback('shape-analysis-feedback');
}

// Object Properties Game
function initializeObjectProperties() {
    // No special initialization needed, just radio buttons
}

function checkObjectProperties() {
    const radioGroups = ['cube-prop', 'lemon-prop', 'bottle-prop', 'book-prop', 'ball-prop', 'egg-prop'];
    let correct = 0;
    let total = radioGroups.length;
    
    radioGroups.forEach(groupName => {
        const selectedRadio = document.querySelector(`#object-properties input[name="${groupName}"]:checked`);
        if (selectedRadio) {
            if (selectedRadio.dataset.correct === 'true') {
                correct++;
                selectedRadio.parentElement.style.backgroundColor = '#4CAF50';
                selectedRadio.parentElement.style.color = 'white';
            } else {
                selectedRadio.parentElement.style.backgroundColor = '#f44336';
                selectedRadio.parentElement.style.color = 'white';
            }
        }
    });
    
    showFeedback('object-properties-feedback', correct, total);
    updateScore(correct === total ? 15 : 0);
}

function resetObjectProperties() {
    const radios = document.querySelectorAll('#object-properties input[type="radio"]');
    radios.forEach(radio => {
        radio.checked = false;
        radio.parentElement.style.backgroundColor = '';
        radio.parentElement.style.color = '';
    });
    
    clearFeedback('object-properties-feedback');
}
