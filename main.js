// Following the rules of https://playsnake.org/

document.addEventListener("keydown", inputKeyPressed, false);

var intervalFunction;
var lastMovement = "None";

// https://stackoverflow.com/questions/12153357/how-to-register-document-onkeypress-event
function inputKeyPressed(event) {

    updateSnakeHead();

    const keyCode = event.keyCode;
    // enums for valid button keycodes
    const buttonKeys = {
        LEFTARROW: 37,
        UPARROW: 38,
        RIGHTARROW: 39,
        DOWNARROW: 40,
        SPACEBAR: 32,
        ENTER: 13
    }

    if (keyCode == buttonKeys.UPARROW) {
        if (lastMovement == "Up" || lastMovement == "Down") {
            // Can't move vertically if already moving vertically
        } else {
            clearInterval(intervalFunction);
            setTimeout(upMovement, 250);
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
        // https://stackoverflow.com/questions/18070659/run-javascript-function-at-regular-time-interval
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
        // alert("Paused! Press arrow keys to restart.");
        lastMovement = "Space"
        clearInterval(intervalFunction);
    }
    else if (keyCode == buttonKeys.ENTER) {
        increaseSize();
    }
    else {
        // Maybe start the game with down
    }
}

var snakeArray = [];
function updateSnakeHead() {
    const headPosition = calculatePositionOfHead();
    snakeArray[0] = headPosition;
    console.log(snakeArray);
}

function updateSnakeBody() {
    for (let i = 1; i < snakeArray.length; i++) {
        snakeArray[i] = snakeArray[i - 1];
    }
}

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
        newTailY = tailY - 20;
        newTailX = tailX;
    } else if (lastMovement == "Down") {
        newTailY = tailY + 20;
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

function rightMovement() {
    updateSnakeHead();
    updateSnakeBody();
    for (let i = 1; i < snakeArray.length; i++) {
        const bodyXPos = snakeArray[i].x;
        const bodyYPos = snakeArray[i].y;
        document.getElementById('body' + i).style.marginLeft = bodyXPos + 'px';
        document.getElementById('body' + i).style.marginTop = bodyYPos + 'px';
    }
    const headPosition = calculatePositionOfHead();
    const xPos = headPosition.x;
    const yPos = headPosition.y;

    // console.log(xPos);
    // Keep this as 20, width of player + outline
    let newXPos = xPos + 20;

    // TODO: maybe set blockWidth as global var for DRY, or maybe get rid
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);
    const blockWidth = parseInt(style.width);
    
    const playerRight = newXPos + 20;
    // check if player's right edge is outside of screen
    if (playerRight > 500) {
        alert("Game over!");
        clearInterval(intervalFunction);
        newXPos = xPos;
    }

    document.getElementById('player').style.marginLeft = newXPos + 'px';


}

// https://zellwk.com/blog/css-values-in-js/
function leftMovement() {
    const xPos = calculatePositionOfHead().x;
    // console.log(xPos);
    let newXPos = xPos - 20;

    // TODO: maybe set blockWidth as global var for DRY
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);
    const blockWidth = parseInt(style.width);

    const playerLeft = newXPos;
    // check if player's left edge is outside of screen
    if (playerLeft < 0) {
        alert("Game over!");
        // Stop the player and set position to edge of screen
        clearInterval(intervalFunction);
        newXPos = xPos;
        // newXPos = 480;
    }

    document.getElementById('player').style.marginLeft = newXPos + 'px';

    updateSnakeHead();
    updateSnakeBody();
}

function upMovement() {
    const yPos = calculatePositionOfHead().y;
    let newYPos = yPos - 20;

    const playerTop = newYPos;
    // check if player's top edge is outside of screen
    if (playerTop < 0) {
        alert("Game over!");
        clearInterval(intervalFunction);
        newYPos = yPos;
        // newYPos = 480;
    }

    document.getElementById('player').style.marginTop = newYPos + 'px';

    updateSnakeHead();
    updateSnakeBody();
}

function downMovement() {
    const yPos = calculatePositionOfHead().y;
    let newYPos = yPos + 20;
    
    //TODO: change 20 to height of player
    const playerBottom = newYPos + 20;
    // check if player's bottom edge is outside of screen
    if (playerBottom > 500) {
        alert("Game over!");
        clearInterval(intervalFunction);
        newYPos = yPos;
        // newYPos = 0;
    }

    document.getElementById('player').style.marginTop = newYPos + 'px';
    
    updateSnakeHead();
    updateSnakeBody();
    
    // for (let i = 1; i <= snakeArray.length; i++) {
    //     const bodyYPos = newYPos - (i * 20);
    //     document.getElementById('body' + i).style.marginTop = bodyYPos + 'px';
    // }
}