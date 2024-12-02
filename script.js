/**** SETUP CODE ****/

// Call the init function when the HTML window loads
window.onload = init;

function init() {
  // Init function that sets up our canvas. 
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  // Start the first frame request to begin the game loop
  window.requestAnimationFrame(gameLoop);

}

/**** OBJECT CREATION FUNCTIONS ****/

// Write the circle object function here


// Write the createCircle function here. 


// Write the randomInteger function here. 


/**** GAMELOOP ****/

function gameLoop(timestamp) {

  // Call the createCircle function here

  // This causes the game to loop every frame. 
  window.requestAnimationFrame(gameLoop);
}



