// Following the rules of https://playsnake.org/

document.addEventListener("keydown", inputKeyPressed, false);

var intervalFunction;
var lastMovement = "None";

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
        clearInterval(intervalFunction);
    }
    else if (keyCode == buttonKeys.ENTER) {
        increaseSize();
    }
    else {

    }
}

var snakeArray = [];
function increaseSize() {
    const element = document.querySelector('.screen');
    const xHeadPos = calculatePositionOfHead().x;
    const yHeadPos = calculatePositionOfHead().y;

    const index = snakeArray.length + 1;
    snakeArray.push(index);

    const xBodyPos = calculatePositionOfNewBody(xHeadPos, yHeadPos, lastMovement).x;
    const yBodyPos = calculatePositionOfNewBody(xHeadPos, yHeadPos, lastMovement).y;

    console.log(xBodyPos);
    // https://stackoverflow.com/questions/5677799/how-to-append-data-to-div-using-javascript
    // TODO: make width dynamically?
    element.innerHTML += '<div id="body' + index + '" style="background-color: orange; position:absolute; width:18px; height:18px; margin-left:' + xBodyPos + 'px; margin-top:' + yBodyPos + 'px; border: black solid 1px;"></div>';
    console.log("ran");
}

function calculatePositionOfNewBody(headX, headY, lastMovement) {
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);
    
    const width = parseInt(style.width);
    const size = snakeArray.length;

    if (lastMovement == "Right") {
        let xBodyPos = (width) * size;
        xBodyPos = headX - xBodyPos;
        const yBodyPos = headY;
        return {x: xBodyPos, y: yBodyPos}
    } else {
        let xBodyPos = (width + offSet) * size;
        xBodyPos += headX;
        const yBodyPos = headY;
        return {x: xBodyPos, y: yBodyPos}
    }
}

function calculatePositionOfHead() {
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);

    const xPos = parseInt(style.marginLeft);
    const yPos = parseInt(style.marginTop);

    return {x: xPos, y: yPos};
}

// https://zellwk.com/blog/css-values-in-js/
function leftMovement() {
    const xPos = calculatePositionOfHead().x;
    // console.log(xPos);
    let newXPos = xPos - 20;

    const playerLeft = newXPos;
    // check if player's left edge is outside of screen
    if (playerLeft < 0) {
        newXPos = 480;
    }

    document.getElementById('player').style.marginLeft = newXPos + 'px';
}

function rightMovement() {
    const xPos = calculatePositionOfHead().x;
    console.log(xPos);
    let newXPos = xPos + 20;

    // TODO: maybe set width as global var for DRY
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);
    const width = parseInt(style.width);
    
    const playerRight = newXPos + width;
    // check if player's right edge is outside of screen
    if (playerRight > 500) {
        newXPos = 0;
    }

    // TODO: have to set new right edge, do a border maybe
    document.getElementById('player').style.marginLeft = newXPos + 'px';
    for (let i = 1; i <= snakeArray.length; i++) {
        const bodyXPos = newXPos - (i * width);
        document.getElementById('body' + i).style.marginLeft = bodyXPos + 'px';
    }
}

function upMovement() {
    const yPos = calculatePositionOfHead().y;
    let newYPos = yPos - 20;

    const playerTop = newYPos;
    // check if player's top edge is outside of screen
    if (playerTop < 0) {
        newYPos = 480;
    }

    document.getElementById('player').style.marginTop = newYPos + 'px';
}

function downMovement() {
    const yPos = calculatePositionOfHead().y;
    let newYPos = yPos + 20;
    
    //TODO: change 20 to height of player
    const playerBottom = newYPos + 20;
    // check if player's bottom edge is outside of screen
    if (playerBottom > 500) {
        newYPos = 0;
    }

    document.getElementById('player').style.marginTop = newYPos + 'px';
}