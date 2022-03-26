class Block {
    constructor(x, y,img) {
        this._x = x;
        this._y = y;
        this._img = img;
    }

    set x_axis(x) {
        this._x = x;
    }

    get x_axis() {
        return this._x;
    }


    set y_axis(y) {
        this._y = y;
    }

    get y_axis() {
        return this._y;
    }

    get dim() {
        return this._d;
    }

    get img(){
        return this._img;
    }

    set img(img){
         this._img = img;
    }
}

document.addEventListener("keydown", move);
var scoreTable = document.getElementById("scoreTable");
var score = 0;
var button = document.getElementById("playButton");
button.addEventListener("click",play);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "grey";
ctx.fillRect(0, 0, canvas.width, canvas.height);
var headImg = new Image();
headImg.src  = "head.png";
var blockImg = new Image();
blockImg.src = "block.png";
var foodImg = new Image();
foodImg.src = "apple.png";
var  snake;
var drawInterval;
var food;
var dir;


function move(e) {
    if (e.key == "w")
        if (dir == "e" || dir == "w")
            dir = "n";
    if (e.key == "a")
        if (dir == "n" || dir == "s")
            dir = "w";
    if (e.key == "s")
        if (dir == "e" || dir == "w")
            dir = "s";
    if (e.key == "d")
        if (dir == "n" || dir == "s")
            dir = "e";
}

function draw() {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Apre il frame
    ctx.beginPath()

    //Disegno la mela
    ctx.drawImage(foodImg,food.x_axis, food.y_axis);

    //Calcolo le posizioni dei blocchi
    //Ogni blocco prende la posizione del precedente
    //La testa si sposta in base alla direzione del movimento dell'utente
    for (var i = snake.length - 1; i > 0; i--) {
        snake[i].x_axis = snake[i - 1].x_axis;
        snake[i].y_axis = snake[i - 1].y_axis;
    }
    if (dir == "n")
        snake[0].y_axis = snake[0].y_axis - 20;
    if (dir == "e")
        snake[0].x_axis = snake[0].x_axis + 20;
    if (dir == "s")
        snake[0].y_axis = snake[0].y_axis + 20;
    if (dir == "w")
        snake[0].x_axis = snake[0].x_axis - 20;

    //Disegno il serpente
    snake.forEach(function (e,index) {
        if(index == 0)
        ctx.drawImage(headImg,e.x_axis, e.y_axis);
        else
        ctx.drawImage(blockImg,e.x_axis, e.y_axis);
    })

    //Collissione tra la testa del serpente e il cibo
    //Aggiungo un nuovo blocco al serpente e riposiziono il cibo in modo casuale
    if (snake[0].x_axis < food.x_axis + 20 &&
        snake[0].x_axis + 20 > food.x_axis &&
        snake[0].y_axis < food.y_axis + 20 &&
        snake[0].y_axis + 20 > food.y_axis) {           
        ctx.clearRect(food.x_axis, food.y_axis, 20, 20);
        ctx.fillStyle = "grey";
        ctx.fillRect(food.x_axis, food.y_axis, 20, 20);
        setScore();
        //Genero casualmente le nuove coordinate del cibo,controllando
        //che non si generi sovrapposto al serpente
        food.x_axis = getRandom();
        food.y_axis = getRandom();
        j=0;
        while(j < snake.length){
            if (snake[j].x_axis < food.x_axis + 20 &&
                snake[j].x_axis + 20 > food.x_axis &&
                snake[j].y_axis < food.y_axis + 20 &&
                snake[j].y_axis + 20 > food.y_axis) {
                food.x_axis = getRandom();
                food.y_axis = getRandom();
                j=0;
            }
            j++;
        }
        var block;
        if (dir == "n")
            block = new Block(snake[snake.length - 1].x_axis, snake[snake.length - 1].y_axis + 20, blockImg)
        if (dir == "e")
            block = new Block(snake[snake.length - 1].x_axis - 20, snake[snake.length - 1].y_axis,blockImg)
        if (dir == "s")
            block = new Block(snake[snake.length - 1].x_axis, snake[snake.length - 1].y_axis - 20,blockImg)
        if (dir == "w")
            block = new Block(snake[snake.length - 1].x_axis + 20, snake[snake.length - 1].y_axis,blockImg)
        snake.push(block)
    }
    ctx.fill();
    
    //Chiude il frame
    ctx.closePath();

    //Collisione con se stessi
    snake.forEach(function (e, index) {
        if (index > 0 && snake[0].x_axis == e.x_axis && snake[0].y_axis == e.y_axis)
            end();
    })

    //Collisione coi bordi
    if (snake[0].x_axis >= canvas.width || snake[0].x_axis < 0 || snake[0].y_axis >= canvas.height || snake[0].y_axis < 0)
        end();

}

function getRandom() {
    return Math.random() * (481 - 20) + 20;
}

function setScore(){
    score++;
    scoreTable.innerHTML =  "Score: " + score;
}

function end() {
    clearInterval(drawInterval);
    window.alert("You died!You scored " + score + " points.");
    score = -1;
    setScore();
    button.addEventListener("click",play);
    
}

function init(){
    snake = [];
    snake.push(new Block(200, 100,headImg));
    food = new Block(350, 350,foodImg);
    dir = "s";

}
function play(){
    button.removeEventListener("click",play);
    init();
    drawInterval = setInterval(draw, 1000 / 10);   
}