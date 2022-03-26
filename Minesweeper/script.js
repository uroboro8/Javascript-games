var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
document.addEventListener("click", fold);
document.addEventListener('contextmenu', placeFlag);
var flagP = document.getElementById("flagCounter");
var timerP = document.getElementById("timer");

var grid = [];
var mineImg = new Image();
mineImg.src = "mine.png";
var flagImg = new Image();
flagImg.src = "flag.png";


class Cell {
    constructor(x, y, mine, neighbour, folded, flag) {
        this._x = x;
        this._y = y;
        this._mine = mine;
        this._neighbour = neighbour;
        this._folded = folded;
        this._flag = flag;
    }

    get x() {
        return this._x;
    }

    set x(x) {
        this._x = x;
    }


    get y() {
        return this._y;
    }

    set y(y) {
        this._y = y;
    }


    get mine() {
        return this._mine;
    }

    set mine(mine) {
        this._mine = mine;
    }

    get neighbour() {
        return this._neighbour;
    }

    neighbours() {
        var mineCounter = 0;
        var startx = this._x - 1, starty = this._y - 1;
        var endx = this._x + 1, endy = this._y + 1;
        if (this._y == 0) {
            starty = this._y;

        }
        else if (this._y == 9) {
            endy = this._y;

        }
        if (this._x == 0)
            startx = this._x;
        else if (this._x == 9)
            endx = this._x;

        for (var i = startx; i <= endx; i++)
            for (var j = starty; j <= endy; j++) {
                if (grid[i][j].mine)
                    mineCounter++;
            }
        this._neighbour = mineCounter;

    }

    get folded() {
        return this._folded;
    }

    set folded(folded) {
        this._folded = folded;
    }

    get flag() {
        return this._flag;
    }

    set flag(flag) {
        this._flag = flag;
    }
}

class Drawer {
    drawGrid() {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                ctx.beginPath();
                ctx.rect(i * 50, j * 50, 50, 50);
                ctx.strokeStyle = "black";
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    drawRect(x, y, color) {
        ctx.beginPath();
        ctx.rect(x, y, 50, 50);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    drawMine(x, y) {
        ctx.beginPath();
        ctx.drawImage(mineImg, x, y);
        ctx.closePath();

    }

    drawNumber(text, x, y) {
        ctx.beginPath();
        ctx.font = "40px serif";
        ctx.fillStyle = "black";
        ctx.fillText(text + "", x, y);
        ctx.closePath();
    }

    drawFlag(x, y) {
        ctx.beginPath();
        ctx.drawImage(flagImg, x, y);
        ctx.closePath();
    }

}

var isStart = true;
var timer;
var timeCount = 0;
var mineCount = 10;
var maxFlag = 10;
var flagCount = 0;
var drawer = new Drawer();

window.onload = loadGrid();
drawer.drawGrid();


function foldAllMines(win) {
    for (var i = 0; i < 10; i++)
        for (var j = 0; j < 10; j++)
            if (grid[i][j].mine)
                grid[i][j].folded = true;
    for (var i = 0; i < 10; i++)
        for (var j = 0; j < 10; j++)
            if (grid[i][j].folded && grid[i][j].mine)
                drawer.drawMine(i * 50, j * 50);

    drawer.drawGrid();
    document.removeEventListener("click", fold);
    document.removeEventListener('contextmenu', placeFlag);
    isStart = true;
    clearInterval(timer);

    if (win)
        window.alert("Complimenti,hai vinto.");
    else
        window.alert("Mi dispiace,hai perso.");
}


function loadGrid() {
    for (var i = 0; i < 10; i++) {
        if (!grid[i])
            grid[i] = [];
        for (var j = 0; j < 10; j++) {
            grid[i][j] = new Cell(i, j, false, 0, false, false);
        }
    }
    var mineCounter = 0;
    while (mineCounter < mineCount) {
        var i = Math.floor(Math.random() * 10);
        var j = Math.floor(Math.random() * 10);
        if (!grid[i][j].mine) {
            grid[i][j].mine = true;
            mineCounter++;
        }
    }
    for (var i = 0; i < 10; i++)
        for (var j = 0; j < 10; j++)
            grid[i][j].neighbours();
}


function fold(e) {
    var countFolded = 0;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (e.clientX > grid[i][j].x * 50 &&
                e.clientX < grid[i][j].x * 50 + 50 &&
                e.clientY > grid[i][j].y * 50 &&
                e.clientY < grid[i][j].y * 50 + 50) {
                if (isStart) {
                    isStart = false;
                    timer = setInterval(setTimer, 1000);
                }
                if (!grid[i][j].flag) {
                    if (grid[i][j].mine) {
                        foldAllMines(false);
                        break;
                    }
                    else {
                        if (grid[i][j].neighbour == 0)
                            showArea(grid[i][j]);
                        else {
                            grid[i][j].folded = true;
                            drawer.drawRect(grid[i][j].x * 50, grid[i][j].y * 50, "grey");
                            drawer.drawNumber(grid[i][j].neighbour + "", i * 50 + 15, j * 50 + 35)
                        }
                    }
                }
            }

        }
    }

    for (var i = 0; i < 10; i++)
        for (var j = 0; j < 10; j++)
            if (!grid[i][j].folded)
                countFolded++;
    drawer.drawGrid();
    if (countFolded == 10)
        foldAllMines(true);
}

function showArea(cell) {
    if (cell.neighbour != 0) {
        cell.folded = true;
        if (cell.flag) {
            cell.flag = false;
            flagCount--;
        }
        drawer.drawRect(cell.x * 50, cell.y * 50, "grey");
        drawer.drawNumber(cell.neighbour + "", cell.x * 50 + 15, cell.y * 50 + 35);
    }
    else if (!cell.folded) {
        drawer.drawRect(cell.x * 50, cell.y * 50, "grey");
        if (cell.flag) {
            cell.flag = false;
            flagCount--;
        }
        cell.folded = true;
        var startx = cell.x - 1, starty = cell.y - 1;
        var endx = cell.x + 1, endy = cell.y + 1;
        if (cell.y == 0)
            starty = cell.y;
        else if (cell.y == 9)
            endy = cell.y;
        if (cell.x == 0)
            startx = cell.x;
        else if (cell._x == 9)
            endx = cell.x;

        for (var i = startx; i <= endx; i++)
            for (var j = starty; j <= endy; j++) {
                showArea(grid[i][j]);
            }
    }
}

function placeFlag(e) {
    e.preventDefault();
    for (var i = 0; i < 10; i++)
        for (var j = 0; j < 10; j++)
            if (e.clientX > grid[i][j].x * 50 &&
                e.clientX < grid[i][j].x * 50 + 50 &&
                e.clientY > grid[i][j].y * 50 &&
                e.clientY < grid[i][j].y * 50 + 50) {
                if (isStart) {
                    isStart = false;
                    timer = setInterval(setTimer, 1000);
                }
                if (!grid[i][j].flag && flagCount < maxFlag && !grid[i][j].folded) {
                    grid[i][j].flag = true;
                    drawer.drawFlag(i * 50, j * 50);
                    flagCount++;
                    flagP.innerHTML = "Flags: " + (maxFlag - flagCount);
                }
                else if (grid[i][j].flag) {
                    grid[i][j].flag = false;
                    flagCount--;
                    drawer.drawRect(i * 50, j * 50, "white");
                    flagP.innerHTML = "Flags: " + (maxFlag - flagCount);
                }
            }
    drawer.drawGrid();
}

function setTimer() {
    timeCount++;
    timerP.innerHTML = "Timer: " + timeCount;

}