// Trying to follow the rules of https://playsnake.org/

// Global variables
let intervalFunction;               // Keeps track of the movement function we repeatedly call to shift the snake
let lastMovement = "None";          // Keeps track of the last key the user pressed in a string
let movementBeforePause = "None";
let applePosition = {};             // Empty applePosition with x and y key values to be filled by generateApple() in window.onload
let snakeArray = [];                // An array of objects keeping track of the position of each segment of the snake, object each have x and y value
let lastPosition = {};              // Stores the last position of snake in updateSnakeBody() for adding new segments onto the snake in increaseSize()
let squareSize = 20;                // Width and height of each grid coordinate of screen and snake's segment (including outline)

// Run this function on start of game, when all the elements of the page is loaded
// https://stackoverflow.com/questions/2632137/why-is-document-getelementbyid-returning-null
window.onload = function() {
    // Sets the position of the apple visually and logically in applePosition object
    generateApple();

    // Start the game with snake moving downwards
    downMovement();
    const headPosition = calculatePositionOfHead();
    // Snake has length of 3 on start of game
    const body1Position = {
        x: headPosition.x,
        y: headPosition.y - squareSize
    }
    const body2Position = {
        x: headPosition.x,
        y: headPosition.y - (squareSize * 2)
    }

    snakeArray[0] = headPosition;
    snakeArray[1] = body1Position;
    snakeArray[2] = body2Position;
    intervalFunction = setInterval(downMovement, 500);
    lastMovement = "Down";
}

// Add event listener for user key inputs to the document and link it to inputKeyPressed function
document.addEventListener("keydown", inputKeyPressed, false);

// Checks for what key has been pressed, then calls the corresponding movement function
// https://stackoverflow.com/questions/12153357/how-to-register-document-onkeypress-event
function inputKeyPressed(event) {

    const keyCode = event.keyCode;
    // enums for valid button keycodes
    const buttonKeys = {
        LEFTARROW: 37,
        UPARROW: 38,
        RIGHTARROW: 39,
        DOWNARROW: 40,
        SPACEBAR: 32,
    }

    if (keyCode == buttonKeys.UPARROW) {
        if (lastMovement == "Up" || lastMovement == "Down") {
            // Can't move vertically if already moving vertically
        } else if (lastMovement == "Space") {
            // Game was just paused, can go up unless movementBeforePause was down
            if (movementBeforePause != "Down") {
                clearInterval(intervalFunction);
                setTimeout(upMovement, 250);
                intervalFunction = setInterval(upMovement, 500);
                lastMovement = "Up";
            }
        } 
        else {
            // Clear running previous movement function that was set at an interval
            clearInterval(intervalFunction);
            
            // Call upMovement with 250ms delay
            setTimeout(upMovement, 250);
            
            // https://stackoverflow.com/questions/18070659/run-javascript-function-at-regular-time-interval
            // Every subsequent upMovement call has 500ms delay
            intervalFunction = setInterval(upMovement, 500);

            lastMovement = "Up";
        }
    }     
    else if (keyCode == buttonKeys.DOWNARROW) {
        if (lastMovement == "Up" || lastMovement == "Down") {
            // Can't move vertically if already moving vertically
        }
        else if (lastMovement == "Space") {
            // Game was just paused, can go down unless movementBeforePause was up
            if (movementBeforePause != "Up") {
                clearInterval(intervalFunction);
                setTimeout(downMovement, 250);
                intervalFunction = setInterval(downMovement, 500);
                lastMovement = "Down";
            }
        }
        else {
            // clear previous movements and do initial call of down movement with 250ms delay
            clearInterval(intervalFunction);
            setTimeout(downMovement, 250);
            intervalFunction = setInterval(downMovement, 500);
            lastMovement = "Down";
        }
    }
    else if (keyCode == buttonKeys.LEFTARROW) {
        if (lastMovement == "Right" || lastMovement == "Left") {
            // Can't move horizontally if already moving horizontally
        }
        else if (lastMovement == "Space") {
            // Game was just paused, can go left unless movementBeforePause was right
            if (movementBeforePause != "Right") {
                clearInterval(intervalFunction);
                setTimeout(leftMovement, 250);
                intervalFunction = setInterval(leftMovement, 500);
                lastMovement = "Left";
            }
        }
        else {
            clearInterval(intervalFunction);
            setTimeout(leftMovement, 250);
            intervalFunction = setInterval(leftMovement, 500);
            lastMovement = "Left";
        }
    }
    else if (keyCode == buttonKeys.RIGHTARROW) {
        if (lastMovement == "Right" || lastMovement == "Left") {
            // Can't move horizontally if already moving horizontally
        }
        else if (lastMovement == "Space") {
            // Game was just paused, can go right unless movementBeforePause was left
            if (movementBeforePause != "Left") {
                clearInterval(intervalFunction);
                setTimeout(rightMovement, 250);
                intervalFunction = setInterval(rightMovement, 500);
                lastMovement = "Right";
            }
        }
        else {
        clearInterval(intervalFunction);
        setTimeout(rightMovement, 250);
        intervalFunction = setInterval(rightMovement, 500);
        lastMovement = "Right";
        }
    }
    else if (keyCode == buttonKeys.SPACEBAR) {
        // Pauses the game by clearing previous movement function
        alert("Paused! Try arrow keys to restart.");
        // Need to store movement before pausing, presents a problem if moving left, pause/unpause, then move right
        movementBeforePause = lastMovement;
        lastMovement = "Space";
        clearInterval(intervalFunction);
    }
    else {
    }
}

/*  Function for when up arrow key is pressed. Updates snake position in snakeArray as well as 
    visually in HTML. Checks if snake is outside of screen, collides with itself, or collides with
    apple. */
function upMovement() {
    // First, call calculatePositionOfHead to get its position
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    // Up movement means that marginTop px value will decrease, want to decrease by 20px (size of square) each frame
    let newYPos = yPos - squareSize;

    const playerTop = newYPos;
    // Check if player's top edge is outside of screen, end the game if it is
    if (playerTop < 0) {
        // First way to lose the game is by going out of bounds
        alert("Game over! Game will restart if you click ok.");
        // Stop any movement functions and refresh page 
        clearInterval(intervalFunction);
        location.reload();
    } else {
        const newHeadPosition = {x: xPos, y: newYPos};
        /*  Updates snake array by setting each index to be the index in front of it so snake "moves forward" and snake head in array with new position
            After updating snake body in array, each segment of the snake is updated visually to reflect the up movement */
        updateSnakeBody(newHeadPosition);
    }

    // Check if snake's head has collided with any body segments or the apple
    checkCollisionWithSelfAndApple();
}

// Returns what the position object of the snake's head is
function calculatePositionOfHead() {
    const element = document.querySelector('.player');
    // Get the style properties of snake's head (marginTop, marginLeft)
    const style = getComputedStyle(element);

    const xPos = parseInt(style.marginLeft);
    const yPos = parseInt(style.marginTop);

    return {x: xPos, y: yPos};
}

//
function updateSnakeBody(newHeadPosition) {
    // Store lastPosition of snake for when snake increase size to be added here, must do this before loop below
    lastPosition = snakeArray[snakeArray.length - 1];
    
    // Update the position of the snake in the snakeArray **KEY CONCEPT
    // Loop from end of snake to head, setting each index to be the index in front of it
    // This follows the idea that each segment follows what is in front of it (the snake's body follow the snake)
    for (let i = snakeArray.length - 1; i >= 1; i--) {
        snakeArray[i] = snakeArray[i - 1];
    }
    // Lastly, set snake's head to new head position passed as a parameter by the movement functions
    snakeArray[0] = newHeadPosition;

    // https://zellwk.com/blog/css-values-in-js/
    // Updates the location of snake's head visually
    document.getElementById('player').style.marginLeft = newHeadPosition.x + 'px';
    document.getElementById('player').style.marginTop = newHeadPosition.y + 'px';
    
    // Update the location of snake's body visually
    for (let i = 1; i < snakeArray.length; i++) {
        const bodyXPos = snakeArray[i].x;
        const bodyYPos = snakeArray[i].y;
        document.getElementById('body' + i).style.marginLeft = bodyXPos + 'px';
        document.getElementById('body' + i).style.marginTop = bodyYPos + 'px';
    }
}

function downMovement() {
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    // Down movement means that marginTop px value will increase each frame
    let newYPos = yPos + squareSize; 

    // + squareSize is for position + height of square
    const playerBottom = newYPos + squareSize;
    // check if player's bottom edge is outside of screen
    if (playerBottom > 500) {
        alert("Game over! Game will restart if you click ok.");
        clearInterval(intervalFunction);
        location.reload();
    } else {
        const newHeadPosition = {x: xPos, y: newYPos};
        updateSnakeBody(newHeadPosition); 
    }

    checkCollisionWithSelfAndApple();
}

function leftMovement() {
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    // Left movement means that marginLeft px value will decrease each frame
    let newXPos = xPos - squareSize;

    const playerLeft = newXPos;
    // check if player's left edge is outside of screen
    if (playerLeft < 0) {
        alert("Game over! Game will restart if you click ok.");
        clearInterval(intervalFunction);
        location.reload();
    } else {
        const newHeadPosition = {x: newXPos, y: yPos};
        updateSnakeBody(newHeadPosition);
    }

    checkCollisionWithSelfAndApple();
}

function rightMovement() {
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    // Right movement means that marginLeft px value will increase each frame
    let newXPos = xPos + squareSize;

    // + squareSize is for position + width of square
    const playerRight = newXPos + squareSize;
    // check if player's right edge is outside of screen
    if (playerRight > 500) {
        alert("Game over! Game will restart if you click ok.");
        clearInterval(intervalFunction);
        location.reload();
    } else {
        const newHeadPosition = {x: newXPos, y: yPos};
        updateSnakeBody(newHeadPosition);
    }

    checkCollisionWithSelfAndApple();
}

// Checks if snake has collided with itself or the apple in the movement functions
function checkCollisionWithSelfAndApple() {
    // The other way to lose the game is by colliding with self
    if (didCollideWithSelf()) {
        // Stop any movement functions and refresh page 
        alert("Game over! Game will restart if you click ok.");
        clearInterval(intervalFunction);
        location.reload();
    }
    // Check if snake has collided with apple
    if (didCollideWithApple()) {
        removeApple();
        increaseSize();
        generateApple();
    }
}

// Returns true if snake's head position matches any of its body's positions
function didCollideWithSelf() {
    const headPosition = snakeArray[0]
    let didCollideWithSelf = false;
    // Loop through to check if snake's head position matches its body's positions
    for (let i = 1; i < snakeArray.length; i++) {
        // https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
        if (headPosition.x == snakeArray[i].x && headPosition.y == snakeArray[i].y) {
            didCollideWithSelf = true;
            break;
        }
    }
    return didCollideWithSelf;
}

// Run when snake collides with apple, adds a new segment to the snake using lastPosition
function increaseSize() {
    const element = document.querySelector('.screen');

    let newTailX, newTailY;
    newTailX = lastPosition.x;
    newTailY = lastPosition.y;

    const newBodySegment = {x: newTailX, y: newTailY};
    // Push to snake array a new snake segment represented by position object from lastPosition
    snakeArray.push(newBodySegment);

    // Add new segment of snake to our screen visually through HTML
    const index = snakeArray.length - 1;
    // https://stackoverflow.com/questions/5677799/how-to-append-data-to-div-using-javascript
    element.innerHTML += '<div id="body' + index + '" style="background-color: orange; position:absolute; width:18px; height:18px; margin-left:' + newTailX + 'px; margin-top:' + newTailY + 'px; border: black solid 1px;"></div>';
}

// Returns true if snake's head positon matches the apple's position
function didCollideWithApple() {
    const headPosition = snakeArray[0]
    let didCollideWithApple = false;
    if (headPosition.x == applePosition.x && headPosition.y == applePosition.y) {
        didCollideWithApple = true;
    }
    return didCollideWithApple;
}

// Sets the position of the apple visually and logically in applePosition object
function generateApple() {
    // Want to set the apple at a round, even coordinate, so divided size of screen (500px) by size of snake's single square (20px) to get 25
    // This is like dividing the screen to a grid with 25 rows and columns
    const min = 0;
    const max = 25;

    // Use random function to find a number between 0 and 25, and then multiply by squareSize (offset or size of square) to get the actual x and y position
    // https://www.geeksforgeeks.org/javascript-math-random-function/
    const randomXPosition = Math.floor(Math.random() * (max - min) + min) * squareSize;
    const randomYPosition = Math.floor(Math.random() * (max - min) + min) * squareSize;
    
    applePosition["x"] = randomXPosition;
    applePosition["y"] = randomYPosition;

    // Set the apple visually or in HTML
    const element = document.getElementById('screen');
    element.innerHTML += '<div id="apple" style="background-color: red; position:absolute; width:20px; height:20px; margin-left:' + randomXPosition + 'px; margin-top:' + randomYPosition + 'px;"></div>';
}

// Remove the apple element from our screen, done when we need to generate a new apple
function removeApple() {
    // https://www.w3schools.com/jsref/met_node_removechild.asp
    const apple = document.getElementById("apple");
    const parent = document.querySelector('.screen');
    parent.removeChild(apple);
}