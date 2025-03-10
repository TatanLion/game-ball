document.addEventListener('DOMContentLoaded', function(){
    let canvas = document.getElementById("canvas-game"); //Seleccionamos el canvas
    let ctx = canvas.getContext("2d"); //Le indicamos que el canvas sera manejado en 2D
    let x = (canvas.width / Math.floor(Math.random() * (20 - 1 + 1) + 1)); //Posición inicial de la bola en X
    let y = canvas.height - 5; //Posición inicial de la bola en Y
    let dx = 7; //Velocidad en X
    let dy = -dx; //Velocidad en Y
    let ballRadius = (canvas.width / 90); //Radio de la bola
    let paddleHeight = 15; //Alto de la paleta
    let paddleWidth = (canvas.width / 5); //Ancho de la paleta
    let paddleX = (canvas.width - paddleWidth) / 2; //Donde debe dibujarse
    let rightPressed = false; //Flag para la tecla derecha
    let leftPressed = false; //Flag para la tecla izquierda

    //Variables para los ladrillos
    let brickRowCount = 7;
    let brickColumnCount = 15;
    let brickWidth = (canvas.width / brickColumnCount) - 13.5;
    let brickHeight = 18;
    let brickPadding = 10;
    let brickOffsetTop = 45;
    let brickOffsetLeft = 30;

    let score = 0; //Variable para el score

    let lives = 3; //Número de vidas

    let level = 1; // Variable para manejar el level

    let bricks = [];
    for(c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for(r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    //AddEventListeners para escuhcar los eventos al presionar los botones
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    // document.addEventListener("mousemove", mouseMoveHandler, false);

    //Funciones para las acciones de los botones
    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            // console.log('Derecha');
            rightPressed = true;
        } else if (e.keyCode == 37) {
            // console.log('Izquierda');
            leftPressed = true;
        }
    }
    function keyUpHandler(e) {
        if (e.keyCode == 39) {
          rightPressed = false;
        } else if (e.keyCode == 37) {
          leftPressed = false;
        }
    }

    //Moverlo con el raton
    // function mouseMoveHandler(e) {
    //     var relativeX = e.clientX - canvas.offsetLeft;
    //     if(relativeX > 0 && relativeX < canvas.width) {
    //         paddleX = relativeX - paddleWidth/2;
    //     }
    // }

    //Funcion para dibujar la bola
    function drawBall() {
        ctx.beginPath(); //Indicamos que iniciamos el dibujo
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2); //Dibujamos la bola
        ctx.fillStyle = "#FB832E"; //Le indicamos el color
        ctx.fill(); //La llenamos con el mismo color
        ctx.closePath(); //Indicamos que cerramos el dibujo
    }

    //Funcion para dibujar los ladrillos
    function drawBricks() {
        for(c=0; c<brickColumnCount; c++) {
            for(r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    var brickX = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight+brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#131A22";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    //Funcion para dibujar el level
    function drawLevel(){
        ctx.font = "30px Arial";
        ctx.fillStyle = "#41368D";
        ctx.fillText("Level: " + level, (canvas.width / 2) - 50, 25);
    }

    //Funcion para detectar colisiones en los ladrillos
    function collisionDetection() {
        for(c = 0; c < brickColumnCount; c++) {
            for(r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        changeLevel();
                    }
                }
            }
        }
    }

    //Funcion para cambiar de nivel
    function changeLevel(){
        if(level == 1){
            if(score == brickRowCount * brickColumnCount) {
                alert(`YOU WIN, CONGRATS! LEVEL ${level} EXCEEDED`);
                paddleWidth = (paddleWidth = (canvas.width / 6));
                for(c = 0; c < brickColumnCount; c++) {
                    bricks[c] = [];
                    for(r = 0; r < brickRowCount; r++) {
                        bricks[c][r] = { x: 0, y: 0, status: 1 };
                    }
                }
                level += 1;
                draw();
            }
        }
        if(level == 2){
            if(score == (brickRowCount * brickColumnCount) * 2) {
                alert(`YOU WIN, CONGRATS! LEVEL ${level} EXCEEDED`);
                paddleWidth = (paddleWidth = (canvas.width / 7));
                for(c = 0; c < brickColumnCount; c++) {
                    bricks[c] = [];
                    for(r = 0; r < brickRowCount; r++) {
                        bricks[c][r] = { x: 0, y: 0, status: 1 };
                    }
                }
                level += 1;
                draw();
            }
        }
    }

    //Función para pintar el score
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fontW
        ctx.fillStyle = "#41368D";
        ctx.fillText("Score: " + score, 8, 20); //Indicar texto y posicionarlo
    }

    //Función para pintar vidas
    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#41368D";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20); //Indicar vidas y posicionarlas
    }

    //Funcion para pintar la bola
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); //Borramos la linea que va dejando la bola
        drawBall(); //Pintamos la bola
        drawPaddle(); //Pintar la paleta
        drawBricks(); //Pintar los ladrillos
        drawScore(); //Pintar el score
        drawLives(); //Pintar vidas
        drawLevel(); //Pintar level
        collisionDetection(); //Verificar colisiones

        // console.log(`X: ${x} -- DX: ${dx} -- CanvasWidth: ${canvas.width}`);
        // console.log(`Y: ${y} -- DY: ${dy} -- CanvasWidth: ${canvas.height}`);

        //Calcular colisión de la bola en las paredes, basado en el radio de la misma.
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height - ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if(!lives) {
                    alert("Perdiste Manco!");
                    document.location.reload();
                    return;
                }
                else {
                    alert(`Te quedan ${lives} vidas`)
                    x = canvas.width / 2;
                    y = canvas.height - 5;
                    dx = 6;
                    dy = -6;
                    paddleX = (canvas.width - paddleWidth ) / 2;
                }
            }
        }

        //Mover la paleta de forma horizontal
        if(rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 12;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 12;
        }

        x += dx; // La movemos en X
        y += dy; // La movemos en Y
        requestAnimationFrame(draw);
    }

    //Funcion para pintar la paleta
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#321B0B";
        ctx.fill();
        ctx.closePath();
    }

    draw();
    
})
