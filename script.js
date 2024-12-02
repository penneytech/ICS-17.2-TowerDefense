/**** SETUP CODE ****/

let canvas, ctx; // Variables for canvas and context
let player, projectiles, enemies, lastEnemySpawn;
const enemySpawnInterval = 1000; // Time in ms between enemy spawns

// Call the init function when the HTML window loads
window.onload = init;

function init() {
  // Init function that sets up our canvas. 
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');

  // Initialize game objects
  resetGame();

  // Set up keyboard input
  setupInput();

  // Start the first frame request to begin the game loop
  window.requestAnimationFrame(gameLoop);
}

function resetGame() {
  player = { x: 300, y: 550, width: 50, height: 10, speed: 5 };
  projectiles = [];
  enemies = [];
  lastEnemySpawn = 0;
}

/**** OBJECT CREATION FUNCTIONS ****/

function createProjectile(x, y) {
  projectiles.push({ x, y, size: 7, speed: 7 });
}

function createEnemy() {
  const quarterWidth = canvas.width / 4; // Divide canvas into four equal parts
  const x = Math.random() * (canvas.width / 2) + quarterWidth; // Spawn only in the middle two quarters
  enemies.push({ x, y: 0, baseSize: 40, speed: 2 });
}


/**** INPUT HANDLING ****/

let keys = {};

function setupInput() {
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') createProjectile(player.x + player.width / 2, player.y); // Fire projectile
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
}

/**** GAMELOOP ****/

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Handle player movement
  if (keys['a'] && player.x > 0) player.x -= player.speed;
  if (keys['d'] && player.x + player.width < canvas.width) player.x += player.speed;

  // Spawn enemies at intervals
  if (timestamp - lastEnemySpawn > enemySpawnInterval) {
    createEnemy();
    lastEnemySpawn = timestamp;
  }

  // Update and draw projectiles
  projectiles.forEach((proj, index) => {
    proj.y -= proj.speed; // Move projectile up

    // Shrink projectile size as it moves up (perspective effect)
    proj.size = Math.max(3, (proj.y / canvas.height) * 7);

    if (proj.y + proj.size < 0) projectiles.splice(index, 1); // Remove if off-screen

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
    ctx.fill();
  });

  enemies.forEach((enemy, eIndex) => {
    enemy.y += enemy.speed; // Move enemy down

    // Simulate perspective: Adjust X position slightly based on spawn direction
    const depthFactor = enemy.y / canvas.height; // Scale between 0 and 1
    const directionOffset = (enemy.x > canvas.width / 2 ? 1 : -1) * 0.4; // Move slightly left or right
    enemy.x += directionOffset * depthFactor * enemy.speed; // Slight lateral movement

    // Adjust enemy size for perspective
    const enemySize = enemy.baseSize * depthFactor;

    // Check for collision with player
    if (
        enemy.x - enemySize / 2 < player.x + player.width &&
        enemy.x + enemySize / 2 > player.x &&
        enemy.y < player.y + player.height &&
        enemy.y + enemySize > player.y
    ) {
        alert('Game Over!');
        resetGame(); // Restart the game without increasing speed
        return;
    }

    // Check for collision with projectiles
    projectiles.forEach((proj, pIndex) => {
        if (
            proj.x - proj.size < enemy.x + enemySize / 2 &&
            proj.x + proj.size > enemy.x - enemySize / 2 &&
            proj.y - proj.size < enemy.y + enemySize &&
            proj.y + proj.size > enemy.y
        ) {
            enemies.splice(eIndex, 1); // Remove enemy
            projectiles.splice(pIndex, 1); // Remove projectile
        }
    });

    // Remove enemies that go off-screen
    if (enemy.y > canvas.height) enemies.splice(eIndex, 1);

    // Draw enemy
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemySize / 2, 0, Math.PI * 2); // Enemies are circles
    ctx.fill();
});


  // Draw player
  ctx.fillStyle = 'green';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // This causes the game to loop every frame.
  window.requestAnimationFrame(gameLoop);
}
