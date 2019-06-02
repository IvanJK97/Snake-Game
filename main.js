// Following the rules of https://playsnake.org/
document.addEventListener("keydown", inputKeyPressed, false);

var intervalFunction;
var lastMovement = "None";
let applePosition = {};

// https://stackoverflow.com/questions/2632137/why-is-document-getelementbyid-returning-null
window.onload = function() {
    generateApple();
}

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

// https://zellwk.com/blog/css-values-in-js/
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

function didCollideWithSelf() {
    //https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    // console.log(snakeArray);
    const headPosition = snakeArray[0]
    let didCollideWithSelf = false;
    for (let i = 1; i < snakeArray.length; i++) {
        if (headPosition.x == snakeArray[i].x && headPosition.y == snakeArray[i].y) {
            didCollideWithSelf = true;
            break;
        }
    }
    return didCollideWithSelf;
}

function generateApple() {
    var min = 0;
    var max = 25;
    // https://www.geeksforgeeks.org/javascript-math-random-function/
    var randomX = Math.floor(Math.random() * (max - min) + min) * 20;
    var randomY = Math.floor(Math.random() * (max - min) + min) * 20;
    
    applePosition["x"] = randomX;
    applePosition["y"] = randomY;
    console.log(applePosition);
    const element = document.getElementById('screen');
    element.innerHTML += '<div id="apple" style="background-color: red; position:absolute; width:20px; height:20px; margin-left:' + randomX + 'px; margin-top:' + randomY + 'px;"></div>';
}

function removeApple() {
    // https://www.w3schools.com/jsref/met_node_removechild.asp
    const apple = document.getElementById("apple");
    const parent = document.querySelector('.screen');
    console.log(parent.removeChild(apple));
}

function didCollideWithApple() {
    const headPosition = snakeArray[0]
    let didCollideWithApple = false;
    if (headPosition.x == applePosition.x && headPosition.y == applePosition.y) {
        didCollideWithApple = true;
    }
    return didCollideWithApple;
}