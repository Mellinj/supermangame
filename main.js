
var superman;
var currentState,
    width,
    height,
    frames = 0,
    hero,
    city,
    okButton,
    startButton,
    heroPositionX = 180,
    heroPositionY = 0,
    icicles;
var myScore;
var currentScore = 0;
var highScore = 0;
var gameViewHeight = 550;

var states = {
    splash: 0,
    game: 1,
    score: 2
};

var
    heroSprite,
    backgroundSprite,
    foregroundSprite,
    topIcicleSprite,
    bottomIcicleSprite,
    okButtonSprite,
    startButtonSprite;


function Hero(x, y, renderingContext){
    this.x = heroPositionX;  // moves left or right
    this.y = 0;  // moves up or down

    this.renderingContext = renderingContext;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0,0,1]; //the sequence

    this.rotation = 0;
    this.radius = 8;

    this.gravity = 0.25;
    this._jump = 3.4; //4.6;


    this.jumpHero = function(){
        this.velocity = -this._jump;
    };

    this.update = function(){
        frames++;

        var h = currentState === states.splash ? 10 : 5; //control speed based on the state
        this.frame += frames % h === 0 ? 1 : 0;
        this.frame %= this.animation.length;  // no matter the length of the animation can bring it in


        if (currentState === states.splash) { //if want character doing something in the splash stage animation wise
            this.updateIdleHero();
        }
        else {
            this.updatePlayingHero();
        }
    };

    this.updatePlayingHero = function(){  //constantly running

        this.velocity += this.gravity;
        this.y += this.velocity;

        // Change to the score state when hero touches the ground

        if (this.y >= height - 110) {
            this.y = height - 110;

            if (currentState === states.game) {
                currentState = states.score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation

            //show crashed superman
            this.rotation = 0.3;

        }

        // If our player hits the top of the canvas, we crash him
        if (this.y <= 2) {
            currentState = states.score;
        }

    };

    this.updateIdleHero = function(){  //constantly running
        //do something with idle
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0
    };



    this.drawHero = function(renderingContext){

        renderingContext.save(); //saving properties saved on sprite and wiping it out and doing it again updating.  Resetting properties.
        renderingContext.translate(0, this.y);

        renderingContext.rotate(this.rotation);

        if(currentState === states.score){ //if game finished
            superman[1].drawSprite(renderingContext, heroPositionX, 50, 1); //show non flapping cape superman only
        } else
        {
            var h = this.animation[this.frame];
            superman[h].drawSprite(renderingContext, heroPositionX, 50, 1); //-superman[h].width, -superman[h].height);  // 140 x 100 y  //coordinates are set
        }
        renderingContext.restore();  // clearing it, setting it, and storing it

    };
}



function Sprite(img, x, y, width, height){
    this.img = img;
    this.x = x;  //twice as large sprite sheet and adjust for mobile this.x = x * 2
    this.y = y;
    this.width = width;
    this.height = height;

    this.drawSprite = function(renderingContext, x, y, xMultiply){
        //alert("in sprite draw");
        renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width*xMultiply, this.height); //one is where sprite is and one is where canvas is
    }
}



function initSprites(img){  //where to create a new character
    superman = [
        new Sprite(img, 13, 8, 100, 38),
        new Sprite(img, 142, 8, 100, 38)
    ];  //array of new sprites

    topIcicleSprite = new Sprite(img, 684, 119, 74, 280);
    bottomIcicleSprite = new Sprite(img, 806, 115, 80, 314);


    backgroundSprite = new Sprite(img, 0, 358, 500, 39);             //water
    foregroundSprite = new Sprite(img, 407, 0, 497, 84);            //city

    okButtonSprite = new Sprite(img, 0, 458, 123, 79);
    startButtonSprite = new Sprite(img, 190, 525, 124, 68);

}

function windowSetup(){
    // Retrieve the width and height of the window
    width = window.innerWidth;
    height = window.innerHeight;

    // Set the width and height
    var inputEvent = "touchstart";
    if (width >= 700) { //500
        width = 500; //380
        height = 500;  //430
        inputEvent = "mousedown";
    }

    // Create a listener on the input event
    document.addEventListener(inputEvent, onpress);

}

function onpress(evt){

    switch (currentState){
        case states.splash:  //starts in splash state, his first jump once jumps once then is in game mode
            currentState = states.game;
            hero.jumpHero();
            break;

        case states.game:  //where we want him jumping is in game state
            hero.jumpHero();
            break;

        case states.score: // Change from score to splash state if event within okButton bounding box
            // Get event position
            var mouseX = evt.offsetX, mouseY = evt.offsetY;

            if (currentScore>=highScore) {
                localStorage.setItem("highscore", currentScore);
            }
            UpdateHighScore();
            showHighScore.text="HIGH SCORE: "+highScore;
            showHighScore.update();


            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }

            // Check if within the okButton
            if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
                okButton.y < mouseY && mouseY < okButton.y + okButton.height
            ) {
                icicles.reset();

                currentState = states.splash;
                currentScore = 0;

            }
            break;
    }
}

function loadImages() {
    var imgAll = new Image();
    imgAll.src = "gamespritesheet.png";
    imgAll.onload = function () {
        initSprites(this);

        okButton = {
            x: (width - okButtonSprite.width) / 2 + 120,
            y: height - 200,
            width: okButtonSprite.width,
            height: okButtonSprite.height
        };
        startButton = {
            x: (width - startButtonSprite.width) / 2 + 120,
            y: height - 200,
            width: startButtonSprite.width,
            height: startButtonSprite.height
        };

        gameLoop();
    };
}

function UpdateHighScore() {
    var storagedHighScore = localStorage.getItem("highscore");
    if (storagedHighScore){
        highScore = storagedHighScore;

    }
    else highScore = 0;

}

window.onload = function(){
    windowSetup();

    currentState = states.splash; // Game begins at the splash screen.

    c = document.getElementById("canvas");
    c.width = window.innerWidth;
    c.style.border = "3px solid black";
    c.height = gameViewHeight;

    //document.body.appendChild(c);

    renderingContext = c.getContext("2d");

    //const hero = new Hero(100, 250, renderingContext);
    hero = new Hero(100, 250, renderingContext);
    icicles = new IcicleCollection();
    environment = new Environment(c, renderingContext);

    myScore = new scoreComponent("30px", "Consolas", "black", 100, 80, "text");
    showHighScore = new scoreComponent("30px", "Consolas", "black", 100, 40, "text");

    document.body.appendChild(c);
    renderingContext.fillStyle = "#FFFFFF";

    UpdateHighScore();


    loadImages();

}


function gameLoop(){
    renderingContext.fillStyle = "#5B6C81";
    renderingContext.fillRect(0, 0, c.width, c.height);
    environment.update();
    environment.render();
    hero.update();


    backgroundSprite.drawSprite(renderingContext, 0, c.height - 20, 3);


    if (currentState === states.game) {
        icicles.update();
        icicles.drawCollection(renderingContext);
    }

    hero.drawHero(renderingContext);

    myScore.text="SCORE: " + currentScore;
    myScore.update();

    if (currentScore > highScore) {
        highScore = currentScore;
    }
    showHighScore.text="HIGH SCORE: "+highScore;
    showHighScore.update();


    if (currentState === states.score) {
        okButtonSprite.drawSprite(renderingContext, okButton.x, okButton.y, 1);
    } else if (currentState === states.splash) {
        startButtonSprite.drawSprite(renderingContext, startButton.x, startButton.y, 1);
    }

    window.requestAnimationFrame(gameLoop); //waits until browser finishes rendering current frame

}


function IcicleCollection() {
    this.icicles = [];

    //Empty icicles array

    this.reset = function () {
        this.icicles = [];
    };

    //Creates and adds a new Icicle to the game.

    this.add = function () {
        this.icicles.push(new Icicle_Instance()); // Create and push icicle to array
    };

    //Update the position of existing icicles and add new icicles when necessary.


    this.update = function () {

        if (frames % 120 === 0) { // Add a new icicle to the game every 100 frames.
            this.add();

        }

        for (var i = 0, len = this.icicles.length; i < len; i++) { // Iterate through the array of icicles and update each.
            var icicle = this.icicles[i]; // The current icicle.

            if (i === 0) { // If this is the leftmost icicle, it is the only icicle that the hero can collide with . . .
                icicle.detectCollision(); // . . . so, determine if the hero has collided with this leftmost icicle.
            }

            icicle.x -= 2; // Each frame, move each icicle two pixels to the left. Higher/lower values change the movement speed.
            //if (icicle.x < -icicle.width) { // If the icicle has moved off screen . . .
            if ((icicle.x + icicle.width) < hero.x) { //If the icicle has moved past hero
                //alert("icicle has past, icicle.x= "+icicle.x+" icicle.width= "+icicle.width+"  hero.x= "+hero.x);
                this.icicles.splice(i, 1); // . . . remove it.
                i--;
                len--;
                currentScore++;
            }
        }

    };

    //Draw all icicles to canvas context.

    this.drawCollection = function () {
        for (var i = 0, len = this.icicles.length; i < len; i++) {
            var icicle = this.icicles[i];
            icicle.drawIcicle();
        }
    };

}

//The Icicle class. Creates instances of Icicle.

function Icicle_Instance() {
    this.x = c.width - bottomIcicleSprite.width-10; //width;
    this.y = height - (bottomIcicleSprite.height + foregroundSprite.height + 120 + 200 * Math.random());
    this.width = bottomIcicleSprite.width;
    this.height = bottomIcicleSprite.height;

    //if the hero has collided with the Icicle.

    this.detectCollision = function () {

        var cx = this.x;
        var cy1 = this.y + this.height - 80;
        var cy2 = this.y + this.height + 110 - 80;
        // Closest difference
        var dx = (hero.x + 49) - cx;    //49 is addjusting hero.x to the horizontal center of hero
        var dy1 = (hero.y - 18) - cy1;    //adjust the hero.y point from top to center,  higher the constant, smaller the allowance for hero to pass
        var dy2 = cy2 - (hero.y + 12);    //adjust the hero.y point from top to center.  higher the constant, smaller allowance for hero to pass
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = hero.radius * hero.radius;
        // Determine intersection
        if ((Math.abs(dx) <= 48 && dy1 <= 3) || (Math.abs(dx) <= 48 && dy2 <= 2)) {

            currentState = states.score;
        }

    };


    this.drawIcicle = function () {

        bottomIcicleSprite.drawSprite(renderingContext, this.x, this.y, 1);
        topIcicleSprite.drawSprite(renderingContext, this.x, this.y + 110 + this.height, 1);

    }

}


function scoreComponent(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = renderingContext;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}