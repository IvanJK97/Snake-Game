// Trying to follow the rules of https://playsnake.org/

// Global variables
let intervalFunction;       // Keeps track of the movement function we repeatedly call to shift the snake
let lastMovement = "None";  // Keeps track of the last key the user pressed in a string
let applePosition = {};     // Empty applePosition with x and y key values to be filled by generateApple() in window.onload

// Run this function on start of game, when all the elements of the page is loaded
// https://stackoverflow.com/questions/2632137/why-is-document-getelementbyid-returning-null
window.onload = function() {
    // Sets the position of the apple visually and logically in applePosition object
    generateApple();

    // Start the game with snake moving downwards
    downMovement();
    const headPosition = calculatePositionOfHead();
    const body1Position = {
        x: headPosition.x,
        y: headPosition.y - 20
    }
    const body2Position = {
        x: headPosition.x,
        y: headPosition.y - 40
    }

    // Snake has length of 3 on start of game
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
        } else {
            // Stop running previous movement function that was set at an interval
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
        } else {
            clearInterval(intervalFunction);
            setTimeout(downMovement, 250);
            intervalFunction = setInterval(downMovement, 500);
            lastMovement = "Down";
        }
    }
    else if (keyCode == buttonKeys.LEFTARROW) {
        if (lastMovement == "Right" || lastMovement == "Left") {
            // Can't move horizontally if already moving horizontally
        } else {
            // clear previous movements and do initial call of left movement with 250ms delay
            clearInterval(intervalFunction);
            setTimeout(leftMovement, 250);
            intervalFunction = setInterval(leftMovement, 500);
            lastMovement = "Left";
        }
    }
    else if (keyCode == buttonKeys.RIGHTARROW) {
        if (lastMovement == "Right" || lastMovement == "Left") {
            // Can't move horizontally if already moving horizontally
        } else {
        clearInterval(intervalFunction);
        setTimeout(rightMovement, 250);
        intervalFunction = setInterval(rightMovement, 500);
        lastMovement = "Right";
        }
    }
    else if (keyCode == buttonKeys.SPACEBAR) {
        // Pauses the game by clearing previous movement function
        alert("Paused! Press arrow keys to restart.");
        lastMovement = "Space"
        clearInterval(intervalFunction);
    }
    else {
    }
}

/*  Function for when up arrow key is pressed. Updates snake position in snakeArray as well as 
    visually in HTML. Checks if snake is outside of screen, collides with itself, or collides with
    apple.
*/
function upMovement() {
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    let newYPos = yPos - 20;

    const playerTop = newYPos;
    // check if player's top edge is outside of screen
    if (playerTop < 0) {
        alert("Game over!");
        clearInterval(intervalFunction);
        newYPos = yPos;
        location.reload();
    } else {
        // https://zellwk.com/blog/css-values-in-js/
        document.getElementById('player').style.marginTop = newYPos + 'px';

        updateSnakeBodyInArray();
        updateSnakeHeadInArray(); //TODO, maybe we can pass in new position directly
    
        for (let i = 1; i < snakeArray.length; i++) {
            const bodyXPos = snakeArray[i].x;
            const bodyYPos = snakeArray[i].y;
            document.getElementById('body' + i).style.marginLeft = bodyXPos + 'px';
            document.getElementById('body' + i).style.marginTop = bodyYPos + 'px';
        }

        if (didCollideWithSelf()) {
            alert("Game over!");
            clearInterval(intervalFunction);
            newYPos = yPos;
            location.reload();
        }

        if (didCollideWithApple()) {
            removeApple();
            increaseSize();
            generateApple();
        }
    }
}

function downMovement() {
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    let newYPos = yPos + 20; // +20 for new position

    const playerBottom = newYPos + 20; // + 20 for position + height of square
    // check if player's bottom edge is outside of screen
    if (playerBottom > 500) {
        alert("Game over!");
        clearInterval(intervalFunction);
        newYPos = yPos;
        location.reload();
    } else {
        document.getElementById('player').style.marginTop = newYPos + 'px';

        updateSnakeBodyInArray();
        updateSnakeHeadInArray(); //TODO, maybe we can pass in new position directly
    
        for (let i = 1; i < snakeArray.length; i++) {
            const bodyXPos = snakeArray[i].x;
            const bodyYPos = snakeArray[i].y;
            document.getElementById('body' + i).style.marginLeft = bodyXPos + 'px';
            document.getElementById('body' + i).style.marginTop = bodyYPos + 'px';
        }

        if (didCollideWithSelf()) {
            alert("Game over!");
            clearInterval(intervalFunction);
            newYPos = yPos;
            location.reload();
        }

        if (didCollideWithApple()) {
            removeApple();
            increaseSize();
            generateApple();
        }
    }
}

function leftMovement() {
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    let newXPos = xPos - 20;

    const playerLeft = newXPos;
    // check if player's left edge is outside of screen
    if (playerLeft < 0) {
        alert("Game over!");
        clearInterval(intervalFunction);
        newXPos = xPos;
        location.reload();
    } else {
        document.getElementById('player').style.marginLeft = newXPos + 'px';

        updateSnakeBodyInArray();
        updateSnakeHeadInArray(); //TODO, maybe we can pass in new position directly
    
        for (let i = 1; i < snakeArray.length; i++) {
            const bodyXPos = snakeArray[i].x;
            const bodyYPos = snakeArray[i].y;
            document.getElementById('body' + i).style.marginLeft = bodyXPos + 'px';
            document.getElementById('body' + i).style.marginTop = bodyYPos + 'px';
        }

        if (didCollideWithSelf()) {
            alert("Game over!");
            clearInterval(intervalFunction);
            newXPos = xPos;
            location.reload();
        }

        if (didCollideWithApple()) {
            removeApple();
            increaseSize();
            generateApple();
        }
    }
}

function rightMovement() {
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    // console.log(xPos);
    // Keep this as 20, width of player + outline
    let newXPos = xPos + 20;

    const playerRight = newXPos + 20;
    // check if player's right edge is outside of screen
    if (playerRight > 500) {
        alert("Game over!");
        clearInterval(intervalFunction);
        newXPos = xPos;
        location.reload();
    } else {
        document.getElementById('player').style.marginLeft = newXPos + 'px';

        updateSnakeBodyInArray();
        updateSnakeHeadInArray(); //TODO, maybe we can pass in new position directly
    
        for (let i = 1; i < snakeArray.length; i++) {
            const bodyXPos = snakeArray[i].x;
            const bodyYPos = snakeArray[i].y;
            document.getElementById('body' + i).style.marginLeft = bodyXPos + 'px';
            document.getElementById('body' + i).style.marginTop = bodyYPos + 'px';
        }

        if (didCollideWithSelf()) {
            alert("Game over!");
            clearInterval(intervalFunction);
            newXPos = xPos;
            location.reload();
            // document.getElementById('player').style.marginLeft = newXPos + 'px';
        }

        if (didCollideWithApple()) {
            removeApple();
            increaseSize();
            generateApple();
        }
    }
}

// Run when snake collides with apple, adds a new segment to the snake
// TODO: need to save an extra in snakeArray for this
function increaseSize() {
    const element = document.querySelector('.screen');
    const tailPosition = snakeArray[snakeArray.length-1];
    const tailX = tailPosition.x;
    const tailY = tailPosition.y;

    let newTailX, newTailY;
    // Using 20 instead of blockWidth, doesn't appear to matter visually??
    if (lastMovement == "Right") {
        newTailX = tailX - 20;
        newTailY = tailY;
    } else if (lastMovement == "Left") {
        newTailX = tailX + 20;
        newTailY = tailY;
    } else if (lastMovement == "Up") {
        newTailY = tailY + 20;
        newTailX = tailX;
    } else if (lastMovement == "Down") {
        newTailY = tailY - 20;
        newTailX = tailX;
    } else {
        // Maybe start the game off with downmovement?
    }

    const newBody = {x: newTailX, y: newTailY};
    snakeArray.push(newBody);

    const index = snakeArray.length - 1;

    // https://stackoverflow.com/questions/5677799/how-to-append-data-to-div-using-javascript
    // TODO: make width dynamically?
    element.innerHTML += '<div id="body' + index + '" style="background-color: orange; position:absolute; width:18px; height:18px; margin-left:' + newTailX + 'px; margin-top:' + newTailY + 'px; border: black solid 1px;"></div>';
}

function calculatePositionOfHead() {
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);

    const xPos = parseInt(style.marginLeft);
    const yPos = parseInt(style.marginTop);

    return {x: xPos, y: yPos};
}

var snakeArray = [];
function updateSnakeHeadInArray() {
    const headPosition = calculatePositionOfHead();
    snakeArray[0] = headPosition;
}

function updateSnakeBodyInArray() {
    for (let i = snakeArray.length - 1; i >= 1; i--) {
        snakeArray[i] = snakeArray[i - 1];
    }
}

function didCollideWithSelf() {
    // console.log(snakeArray);
    const headPosition = snakeArray[0]
    let didCollideWithSelf = false;
    for (let i = 1; i < snakeArray.length; i++) {
        // https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
        if (headPosition.x == snakeArray[i].x && headPosition.y == snakeArray[i].y) {
            didCollideWithSelf = true;
            break;
        }
    }
    return didCollideWithSelf;
}

// Sets the position of the apple visually and logically in applePosition object
function generateApple() {
    // Want to set the apple at a round, even coordinate, so divided size of screen (500px) by size of snake's single square (20px) to get 25
    // This is like dividing the screen to a grid with 25 rows and columns
    const min = 0;
    const max = 25;

    // Use random function to find a number between 0 and 25, and then multiply by 20 (offset or size of square) to get the actual x and y position
    // https://www.geeksforgeeks.org/javascript-math-random-function/
    const randomXPosition = Math.floor(Math.random() * (max - min) + min) * 20;
    const randomYPosition = Math.floor(Math.random() * (max - min) + min) * 20;
    
    applePosition["x"] = randomXPosition;
    applePosition["y"] = randomYPosition;
    // console.log(applePosition);

    // Set the apple visually or in HTML
    const element = document.getElementById('screen');
    element.innerHTML += '<div id="apple" style="background-color: red; position:absolute; width:20px; height:20px; margin-left:' + randomXPosition + 'px; margin-top:' + randomYPosition + 'px;"></div>';
}

function removeApple() {
    // https://www.w3schools.com/jsref/met_node_removechild.asp
    const apple = document.getElementById("apple");
    const parent = document.querySelector('.screen');
    parent.removeChild(apple);
}

function didCollideWithApple() {
    const headPosition = snakeArray[0]
    let didCollideWithApple = false;
    if (headPosition.x == applePosition.x && headPosition.y == applePosition.y) {
        didCollideWithApple = true;
    }
    return didCollideWithApple;
}