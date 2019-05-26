document.addEventListener("keydown", keyDownTextField, false);

var intervalFunction;
// https://stackoverflow.com/questions/12153357/how-to-register-document-onkeypress-event
function keyDownTextField(e) {
    var keyCode = e.keyCode;
    if (keyCode == 37) {
        // https://stackoverflow.com/questions/18070659/run-javascript-function-at-regular-time-interval
        // clear previous movements and do initial call without any delays
        clearInterval(intervalFunction);
        setTimeout(leftMovement, 250);
        intervalFunction = setInterval(leftMovement, 1000);
    } 
    else if (keyCode == 38) {
        clearInterval(intervalFunction);
        setTimeout(upMovement, 250);
        intervalFunction = setInterval(upMovement, 1000);
    }
    else if (keyCode == 39) {
        clearInterval(intervalFunction);
        setTimeout(rightMovement, 250);
        intervalFunction = setInterval(rightMovement, 1000);
    }
    else if (keyCode == 40) {
        clearInterval(intervalFunction);
        setTimeout(downMovement, 250);
        intervalFunction = setInterval(downMovement, 1000);
    }
    else if (keyCode == 32) {
        alert("Paused! Press arrow keys to restart.");
        clearInterval(intervalFunction);
    }
    else if (keyCode == 13) {
        increaseSize();
    }
    else {

    }
}

function increaseSize() {
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);

}

// https://zellwk.com/blog/css-values-in-js/
function leftMovement() {
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);
    console.log(style.marginLeft);

    const xPos = parseInt(style.marginLeft);
    let newXPos = xPos - 20;

    const playerLeft = newXPos;
    // check if player's left edge is outside of screen
    if (playerLeft < 0) {
        newXPos = 480;
    }

    document.getElementById('player').style.marginLeft = newXPos + 'px';
}

function rightMovement() {
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);
    console.log(style.marginLeft);
    
    const xPos = parseInt(style.marginLeft);
    let newXPos = xPos + 20;
    
    // TODO: change 20 to width of player
    const playerRight = newXPos + 20;
    // check if player's right edge is outside of screen
    if (playerRight > 500) {
        newXPos = 0;
    }
    
    document.getElementById('player').style.marginLeft = newXPos + 'px';
}

function upMovement() {
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);
    console.log(style.marginTop);

    const yPos = parseInt(style.marginTop);
    let newYPos = yPos - 20;

    const playerTop = newYPos;
    // check if player's top edge is outside of screen
    if (playerTop < 0) {
        newYPos = 480;
    }

    document.getElementById('player').style.marginTop = newYPos + 'px';
}

function downMovement() {
    const element = document.querySelector('.player');
    const style = getComputedStyle(element);
    console.log(style.marginTop);

    const yPos = parseInt(style.marginTop);
    let newYPos = yPos + 20;
    
    //TODO: change 20 to height of player
    const playerBottom = newYPos + 20;
    // check if player's bottom edge is outside of screen
    if (playerBottom > 500) {
        newYPos = 0;
    }

    document.getElementById('player').style.marginTop = newYPos + 'px';
}