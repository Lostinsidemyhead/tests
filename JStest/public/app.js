import * as snd from './music.js';
const cvs = document.getElementById("app");
const ctx = cvs.getContext("2d");

const ruby = new Image(),
      emer = new Image(), 
      saph = new Image(),
      perl = new Image(),
      diam = new Image(),
      gold = new Image();
ruby.src = "images/ruby.png";
emer.src = "images/emerald.png";
saph.src = "images/sapphire.png";
perl.src = "images/perl.png";
diam.src = "images/diamond.png";
gold.src = "images/gold.png";

let rows = 7,
    cols = 9,
    score = 0,
    width = 800,
    height = 600,
    size = 80;

let grid = new Array();
let mask = new Array();
let units = new Array(
    ruby,
    emer,
    saph,
    perl,
    diam,
    gold
);

app.width = width;
app.height = height;

function createLvl(){
    for (let i = 0; i < rows; i++){
        grid[i] = new Array();
        for (let j = 0; j < cols; j++){
            grid[i][j] = -1;
        }
    }
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            grid[i][j] = Math.floor(units.length * Math.random());
            if (i > 1){
                if (grid[i][j] == grid[i-1][j] && grid[i-1][j]==grid[i-2][j]){
                    grid[i][j] = Math.floor(units.length * Math.random());
                    i--;
                };
            };
            if (j > 1){
                if (grid[i][j] == grid[i][j-1] && grid[i][j-1]==grid[i][j-2]){
                    grid[i][j] = Math.floor(units.length * Math.random());
                    j--;
                };
            };
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            let unit = grid[i][j];
            ctx.drawImage(units[unit], j*(10+size),i*(6+size), size, size); 
        }
    }
    document.getElementById("score").innerHTML = ("Score: " + score);
}

function clearMask(){
    for (let i = 0; i < rows; i++){
        mask[i] = new Array();
        for (let j = 0; j < cols; j++){
            mask[i][j] = 0;
        }
    }
}


let swap = false; 
let shift = false;
let firstClickChecker = false;

function comboBreaker(){
    clearMask();
    app.removeEventListener("click", click);
    //горизонталь
    for (let i = 0; i < rows; i++){
        let count = 1;
        for (let j = 1; j < cols; j++){
           while (grid[i][j] == grid[i][j-1]){
               count++;
               j++;
               if (j==cols){
                   break;
                }
           }
           if (count > 2){
               while (count > 0){
                   mask[i][j-count] = 1;
                   count--;
               }
               count = 1;
           } else {
               count = 1;
           }
        }
    }
    //вертикаль
    for (let j = 0; j < cols; j++){
        let count = 1;
        for (let i = 1; i < rows; i++){
           while (grid[i][j] == grid[i-1][j]){
               count++;
               i++;
               if (i==rows){
                   break;
               }
           }
           if (count > 2){
               while (count > 0){
                   mask[i-count][j] = 1;
                   count--;
               }
               count = 1;
           } else {
               count = 1;
           }
        }
    }
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            if (mask[i][j] == 1){               
                grid[i][j] = -1;
                if (firstClickChecker == true){
                    swap = true;
                }
                score++;
                shift = true;
            }
        }
    }
    if (shift == true){
        downShift();
    }
}

function downShift(){
    let haveEmpty = true;
    while (haveEmpty == true){
        haveEmpty = false;
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < cols; j++){
                if (grid[i][j] < 0){
                    if (i > 0){
                        haveEmpty = true;
                        grid[i][j] = grid[i-1][j];
                        grid[i-1][j]=-1;
                    } else {
                        grid[i][j] = Math.floor(units.length * Math.random());
                    }
                }  
            }
        }
    }
    shift = false;
    comboBreaker();
    draw();
}

function checkAbility(){
    let ability = false;
    for (let i = 1; i < rows-1; i++){
        for (let j = 1; j < cols-1; j++){
           if ((grid[i][j] == grid[i][j-1] && (grid[i][j] == grid[i+1][j+1] || grid[i][j] == grid[i-1][j+1])) ||
               (grid[i][j] == grid[i][j+1] && (grid[i][j] == grid[i-1][j-1] || grid[i][j] == grid[i+1][j-1])) ||
               (grid[i][j] == grid[i-1][j] && (grid[i][j] == grid[i+1][j+1] || grid[i][j] == grid[i+1][j-1])) ||
               (grid[i][j] == grid[i+1][j] && (grid[i][j] == grid[i-1][j-1] || grid[i][j] == grid[i-1][j+1])) ||
               (grid[i][j] == grid[i-1][j-1] && (grid[i][j] == grid[i-1][j+1] || grid[i][j] == grid[i+1][j-1])) ||
               (grid[i][j] == grid[i+1][j+1] && (grid[i][j] == grid[i-1][j+1] || grid[i][j] == grid[i+1][j-1]))){
                ability = true;
           } 
        }
    }
    if (ability == false){
        mixer();
        snd.playMixSound();
    }
}

function mixer(){
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            let k = Math.floor(Math.random(rows));
            let g = Math.floor(Math.random(cols));
            let temp = grid[i][j];
            grid[i][j] = grid[k][g];
            grid[k][g] = temp;
            comboBreaker();
        }
    }
}
let start = false;
let firstUnitX,
    firstUnitY,
    secondUnitX,
    secondUnitY;

function click(target){
    if (start == false){
        setTimeout(timeOut, 100000);
        start = true;
    }
    let x,
        y;
    x = Math.floor(target.offsetX / (size + 10));
    y = Math.floor(target.offsetY / (size + 6));    
    if (!firstClickChecker){
        firstUnitX = x;
        firstUnitY = y;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.rect(firstUnitX * (size+10), firstUnitY * (size+6), size,size);
        ctx.stroke();
        firstClickChecker = true;      
    } else {
        x = Math.floor(target.offsetX / (size + 10));
        y = Math.floor(target.offsetY / (size + 6));
        if ((Math.abs(firstUnitX - x) == 1) && (Math.abs(firstUnitY - y) == 0)||
        (Math.abs(firstUnitX - x) == 0) && (Math.abs(firstUnitY - y) == 1)){
            let temp = grid[y][x];
            grid[y][x] = grid[firstUnitY][firstUnitX];
            grid[firstUnitY][firstUnitX] = temp;
            comboBreaker();
            if (swap==true){
                snd.playSwapSound();
            }
            if (swap == false){
                let temp = grid[y][x];
                grid[y][x] = grid[firstUnitY][firstUnitX];
                grid[firstUnitY][firstUnitX] = temp;
            }
            checkAbility(); 
            swap = false;
            app.addEventListener("click", click);  
        }
        draw(); 
        firstClickChecker = false;
    }
}
function timeOut(){
    removeEventListener("click", click);
    alert("Time is out! Your score: " + score);
}


createLvl();
gold.onload = draw;
app.addEventListener("click", click);
alert('Game will start with first click! You have 100 second!');