// setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Variables para el seguimiento del mouse
let mouseX = 0;
let mouseY = 0;
let eliminatedBalls = 0;

// Detectar posición del mouse
document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Ball class
class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    // Rebote en los bordes
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    // Actualizar posición
    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          // Cambiar colores cuando colisionan
          ball.color = this.color = randomRGB();
          
          // Respuesta física simple a la colisión
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);
          
          // Rotar velocidades
          const vx1 = this.velX * cos + this.velY * sin;
          const vy1 = this.velY * cos - this.velX * sin;
          const vx2 = ball.velX * cos + ball.velY * sin;
          const vy2 = ball.velY * cos - ball.velX * sin;
          
          // Velocidad final después del choque
          this.velX = vx2 * cos - vy1 * sin;
          this.velY = vy1 * cos + vx2 * sin;
          ball.velX = vx1 * cos - vy2 * sin;
          ball.velY = vy2 * cos + vx1 * sin;
        }
      }
    }
  }
}

// Clase para el círculo controlado por el mouse
class UserCircle {
  constructor(size, color) {
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(mouseX, mouseY, this.size, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Añadir cruz en el centro para mejor visualización
    ctx.beginPath();
    ctx.moveTo(mouseX - 10, mouseY);
    ctx.lineTo(mouseX + 10, mouseY);
    ctx.moveTo(mouseX, mouseY - 10);
    ctx.lineTo(mouseX, mouseY + 10);
    ctx.stroke();
  }

  checkCollisions() {
    for (let i = balls.length - 1; i >= 0; i--) {
      const dx = mouseX - balls[i].x;
      const dy = mouseY - balls[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[i].size) {
        // Eliminar bola
        balls.splice(i, 1);
        eliminatedBalls++;
      }
    }
  }
}

// Crear bolas
const balls = [];
const numBalls = 25;

while (balls.length < numBalls) {
  const size = random(10, 20);
  const ball = new Ball(
    // Posición aleatoria dentro del canvas
    random(0 + size, width - size),
    random(0 + size, height - size),
    // Velocidad aleatoria
    random(-7, 7),
    random(-7, 7),
    // Color aleatorio
    randomRGB(),
    size
  );

  balls.push(ball);
}

// Crear círculo del usuario
const userCircle = new UserCircle(30, 'white');

// Función de animación
function loop() {
  // Crear un efecto de trail (rastro)
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // Actualizar y dibujar cada bola
  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  // Dibujar y verificar colisiones con el círculo del usuario
  userCircle.draw();
  userCircle.checkCollisions();

// Mostrar contador de bolas eliminadas
ctx.fillStyle = "white";
ctx.font = "24px Arial";
ctx.textAlign = "left";
ctx.fillText(`Bolas eliminadas: ${eliminatedBalls}`, 20, 70); // Cambiado de 40 a 70 para posicionarlo más abajo

  // Verificar si se han eliminado todas las bolas
  if (balls.length === 0) {
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("¡Todas las bolas eliminadas!", width/2, height/2);
  }

  requestAnimationFrame(loop);
}

// Iniciar animación
loop();