import { Module } from "module";

/*  Function for when up arrow key is pressed. Updates snake position in snakeArray as well as 
    visually in HTML. Checks if snake is outside of screen, collides with itself, or collides with
    apple.
*/
const upMovement = () => {
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

const downMovement = () => {
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

const leftMovement = () => {
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

const rightMovement = () => {
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

Module.exports = {
    up: upMovement,
    down: downMovement,
    left: leftMovement,
    right: rightMovement
}