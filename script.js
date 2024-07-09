document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('plinko-board');
    const dropButton = document.getElementById('drop-button');
    const numRows = 7;
    const pinSpacing = 25; // Espaçamento entre os pinos
    const collisionSpeed = 5; // Velocidade de colisão ajustável
    const dropScopeWidth = 40; // Largura do escopo de queda aleatória

    // Cria os pinos em formato piramidal
    for (let row = 0; row < numRows; row++) {
        const pinsInRow = row * 2 + 1; // Número de pinos na linha atual
        const rowOffset = (board.clientWidth - pinsInRow * pinSpacing) / 2;
        for (let col = 0; col < pinsInRow; col++) {
            const pin = document.createElement('div');
            pin.classList.add('pin');
            pin.style.top = `${row * pinSpacing + pinSpacing}px`;
            pin.style.left = `${rowOffset + col * pinSpacing}px`;
            board.appendChild(pin);
        }
    }

    // Lógica para soltar a bola
    dropButton.addEventListener('click', () => {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        
        // Posiciona a bola aleatoriamente dentro do escopo de queda no meio do tabuleiro
        const startX = board.clientWidth / 2 - dropScopeWidth / 2 + Math.random() * dropScopeWidth;
        ball.style.left = `${startX}px`; // Posição inicial aleatória dentro do escopo
        ball.style.top = '0px';
        board.appendChild(ball);

        let currentTop = 0;
        const fallInterval = setInterval(() => {
            currentTop += 5;
            ball.style.top = `${currentTop}px`;

            // Verifica a colisão com os pinos
            const pins = document.getElementsByClassName('pin');
            let collided = false;
            for (let i = 0; i < pins.length; i++) {
                const pin = pins[i];
                const pinRect = pin.getBoundingClientRect();
                const ballRect = ball.getBoundingClientRect();

                if (ballRect.bottom >= pinRect.top &&
                    ballRect.top <= pinRect.bottom &&
                    ballRect.right >= pinRect.left &&
                    ballRect.left <= pinRect.right) {
                    const direction = Math.random() < 0.5 ? -1 : 1;
                    ball.style.left = `${ball.offsetLeft + direction * pinSpacing / collisionSpeed}px`; // Ajuste da velocidade de colisão
                    collided = true;
                }
            }

            // Remove a bola se ela atingir a parte inferior do tabuleiro
            if (currentTop >= board.clientHeight - 15) {
                clearInterval(fallInterval);
                board.removeChild(ball); // Remove a bola do DOM
            }

            // Remove a bola se passar do último pin sem colidir
            if (!collided && currentTop >= board.clientHeight - 15) {
                clearInterval(fallInterval);
                board.removeChild(ball); // Remove a bola do DOM
            }
        }, 30);
    });
});
