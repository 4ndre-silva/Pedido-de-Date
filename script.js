// Constantes para configuração
const BUTTON_MARGIN = 20;
const ANIMATION_DURATION = 300;
const FIREWORK_PARTICLES = 80; // Aumenta o número de partículas por fogo
const FIREWORK_BURSTS = 20; // Número de "explosões" de fogos (usado como base para frequência)
const FIREWORKS_TOTAL_DURATION = 20 * 1000; // 20 segundos em milissegundos

// Elementos do DOM
const naoButton = document.getElementById('nao');
const simButton = document.getElementById('sim');
const respostaDiv = document.getElementById('resposta');
const backgroundMusic = document.getElementById('backgroundMusic');
const toggleMusic = document.getElementById('toggleMusic');
const volumeControl = document.getElementById('volumeControl');
const heartsContainer = document.querySelector('.hearts-container');
const petalsContainer = document.querySelector('.petals-container');
const container = document.querySelector('.container');
const typewriterText = document.getElementById('typewriter-text');

// Verificação de elementos essenciais (sem lançar erro fatal)
if (!naoButton || !simButton || !respostaDiv || !typewriterText) {
    console.error('Elementos necessários não encontrados no DOM. Alguns recursos podem não funcionar.');
}

// Variável para armazenar a instância do tsParticles
let particlesInstance = null;

// Configuração inicial do tsParticles
const initialParticlesConfig = {
    particles: {
        number: {
            value: 80, // Mais partículas iniciais
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ["#EDC65A", "#431172", "#ffffff"] // Cores iniciais
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.6, // Mais visível inicialmente
            random: true
        },
        size: {
            value: 4, // Partículas iniciais maiores
            random: true
        },
        move: {
            enable: true,
            speed: 1.5, // Movimento inicial mais rápido
            direction: "none",
            random: true,
            out_mode: "out"
        }
    },
    interactivity: {
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            },
             onclick: {
                enable: true,
                mode: "push"
            }
        },
         modes: {
            repulse: {
                distance: 120, // Área de repulsão inicial maior
                duration: 0.5
            },
             push: {
                quantity: 5
            }
        }
    },
     retina_detect: true,
    background: {
        color: "transparent"
    }
};

// Configuração das partículas de celebração
const celebrationConfig = {
    particles: {
        number: {
            value: 150, // Mais partículas
            density: {
                enable: true,
                value_area: 1000 // Área maior
            }
        },
        color: {
            value: ["#EDC65A", "#431172", "#ff6b6b", "#f5d77e", "#ffffff"] // Adiciona branco
        },
        shape: {
            type: ["circle", "triangle", "square", "star"] // Adiciona estrela
        },
        opacity: {
            value: 0.9, // Mais visível
            random: true
        },
        size: {
            value: 6, // Partículas maiores
            random: true
        },
        move: {
            enable: true,
            speed: 5, // Mais rápido
            direction: "none",
            random: true,
            out_mode: "out",
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            }
        },
        modes: {
            repulse: {
                distance: 150, // Área de repulsão maior
                duration: 0.4
            },
            push: {
                quantity: 6 // Empurra mais partículas
            }
        }
    },
    retina_detect: true,
    background: {
        color: "transparent"
    }
};

// Função para gerar posição aleatória dentro dos limites da tela
function getRandomPosition() {
    if (!naoButton) return { x: 0, y: 0 };
    const naoRect = naoButton.getBoundingClientRect();
    const maxX = window.innerWidth - naoRect.width - BUTTON_MARGIN;
    const maxY = window.innerHeight - naoRect.height - BUTTON_MARGIN;
    
    const randomX = Math.min(Math.max(BUTTON_MARGIN, Math.random() * maxX), maxX);
    const randomY = Math.min(Math.max(BUTTON_MARGIN, Math.random() * maxY), maxY);

    return { x: randomX, y: randomY };
}

// Função para mover o botão com animação suave
function moveButton() {
    if (!naoButton) return;
    const position = getRandomPosition();
    naoButton.style.transition = `left ${ANIMATION_DURATION}ms ease, top ${ANIMATION_DURATION}ms ease`;
    naoButton.style.left = position.x + 'px';
    naoButton.style.top = position.y + 'px';
    naoButton.style.position = 'fixed';
}

// Função para criar uma única partícula de fogo
function createFireworkParticle(startX, startY, endX, endY, color) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.backgroundColor = color;
    particle.style.setProperty('--end-x', `${endX}px`);
    particle.style.setProperty('--end-y', `${endY}px`);
    document.body.appendChild(particle);

    // Remove o elemento após a animação (8 segundos) - Ajuste conforme necessário
    setTimeout(() => {
        particle.remove();
    }, 8000);
}

// Função para criar uma "explosão" de fogo de artifício em uma posição
function createFireworkBurst(x, y) {
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    for (let i = 0; i < FIREWORK_PARTICLES; i++) {
        const angle = Math.random() * Math.PI * 2; // Ângulo aleatório completo
        const distance = Math.random() * 150; // Distância aleatória da explosão
        const endX = distance * Math.cos(angle);
        const endY = distance * Math.sin(angle);
        createFireworkParticle(x, y, endX, endY, color);
    }
}

// Função para iniciar a geração contínua de fogos de artifício por um tempo
function startFireworks() {
    const startTime = Date.now();

    function generateBurst() {
        if (Date.now() - startTime < FIREWORKS_TOTAL_DURATION) {
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight * 0.8; // Fica mais na parte superior
            createFireworkBurst(randomX, randomY);
            // Gera próxima explosão com um pequeno atraso aleatório
            setTimeout(generateBurst, Math.random() * 300 + 100); // Atraso entre 100ms e 400ms
        }
    }

    generateBurst(); // Inicia a primeira explosão e o loop
}

// Função para o efeito typewriter
function typeWriter(text, element, speed = 50) {
    if (!element) return;
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.style.borderRight = 'none'; // Remove cursor no final
        }
    }
    
    // Adiciona cursor piscante temporariamente
    element.style.borderRight = '2px solid var(--text-color)';
    type();
}

// Função para iniciar a celebração (tsParticles e Confete)
function startCelebration() {
    // Atualiza a configuração do tsParticles se a instância existir
    if (particlesInstance) {
        particlesInstance.loadTheme(celebrationConfig)
            .catch(error => console.error("Erro ao carregar tema de celebração tsParticles:", error));
    } else if (window.tsParticles) {
        // Inicializa com a configuração de celebração se ainda não foi inicializado
         window.tsParticles.load("tsparticles", celebrationConfig)
            .then(instance => particlesInstance = instance)
            .catch(error => console.error("Erro ao inicializar tsParticles com celebração:", error));
    } else {
        console.error("tsParticles não está carregado para iniciar a celebração.");
    }

    // Efeito de confete usando canvas-confetti
    if (window.confetti) {
        const duration = 7 * 1000; // 7 segundos de confete
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 75; // Mais confetes por explosão
            
            // Dispara confete dos lados esquerdo e direito
            window.confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }
            });
            window.confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }
            });
        }, 200); // Intervalo menor entre as explosões
    } else {
        console.error("canvas-confetti não está carregado.");
    }
}

// --- Event Listeners e Inicialização Principal --- //

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o tsParticles quando o DOM estiver completamente carregado
    if (window.tsParticles) {
        window.tsParticles.load("tsparticles", initialParticlesConfig)
            .then(instance => { particlesInstance = instance; })
            .catch(error => console.error("Erro ao inicializar tsParticles:", error));
    } else {
        console.error("tsParticles não está carregado no DOMContentLoaded.");
    }

    // Evento para o botão "Sim"
    if (simButton && respostaDiv && naoButton && typewriterText) {
        simButton.addEventListener('click', () => {
            respostaDiv.classList.remove('hidden');
            simButton.style.display = 'none';
            naoButton.style.display = 'none';
            
            // Efeito typewriter
            typeWriter("Ui bb agora temos um datezin! 🤪💕", typewriterText);
            
            // Inicia a celebração
            startCelebration();
        });
    }

    // Eventos para o botão "Não"
    if (naoButton) {
        naoButton.addEventListener('mouseover', moveButton);
        naoButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveButton();
        });
    }

    // Ajusta a posição do botão quando a janela é redimensionada
    window.addEventListener('resize', () => {
        if (naoButton && naoButton.style.position === 'fixed') {
            moveButton();
        }
    });
});

// Configuração inicial da música
backgroundMusic.volume = volumeControl.value / 100;
let isMusicPlaying = false;

// Controle de música
toggleMusic.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        toggleMusic.innerHTML = '<span class="material-icons">music_off</span>';
    } else {
        backgroundMusic.play();
        toggleMusic.innerHTML = '<span class="material-icons">music_note</span>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Controle de volume
volumeControl.addEventListener('input', (e) => {
    backgroundMusic.volume = e.target.value / 100;
});

// Criar corações flutuantes
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Criar pétalas
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
    petalsContainer.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 10000);
}

// Iniciar efeitos visuais
setInterval(createHeart, 300);
setInterval(createPetal, 200);

// Efeito de confete melhorado
function createConfetti() {
    const confettiSettings = {
        target: 'confetti-canvas',
        max: 150,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[255, 0, 0], [255, 215, 0], [255, 192, 203]],
        clock: 25,
        rotate: true,
        start_from_edge: true,
        respawn: false
    };

    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}

// Manipulador do botão Sim
simButton.addEventListener('click', () => {
    respostaDiv.classList.remove('hidden');
    respostaDiv.classList.add('visible');
    createConfetti();
    if (!isMusicPlaying) {
        backgroundMusic.play();
        isMusicPlaying = true;
        toggleMusic.innerHTML = '<span class="material-icons">music_note</span>';
    }
});

// Manipulador do botão Não
let naoCount = 0;
naoButton.addEventListener('mouseover', () => {
    naoCount++;
    const maxX = window.innerWidth - naoButton.offsetWidth;
    const maxY = window.innerHeight - naoButton.offsetHeight;
    
    naoButton.style.position = 'fixed';
    naoButton.style.left = Math.random() * maxX + 'px';
    naoButton.style.top = Math.random() * maxY + 'px';
    
    if (naoCount >= 5) {
        naoButton.style.transform = 'scale(0.8)';
    }
});
