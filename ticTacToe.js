var boardBlocks;

var player1 = "X";
var aiplayer = "O";
var winCombos = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];

var cells = $(".col");
gamebegin();

function gamebegin(){
  boardBlocks = Array.from(Array(9).keys());
  console.log(boardBlocks);
  for(var i=0; i<cells.length; i++){
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square){
  if(typeof boardBlocks[square.target.id] == 'number'){
    turn(square.target.id, player1);
    console.log(square.target.id);
    if(!checkTie()) turn(bestSpot(), aiplayer);
  }
}

function turn(id, player){
  boardBlocks[id] = player;
  document.getElementById(id).innerText = player;
  let win = checkWin(boardBlocks, player);
  if(win) gameOver(win);
}

function checkWin(board, player){
  let plays = board.reduce((a,e,i) => (e===player) ? a.concat(i) : a, []);
  let win = null;
  for(let [index, gameWin] of winCombos.entries()){
    if(gameWin.every(elem => plays.indexOf(elem) > -1)){
        win = {index: index, player: player};
        break;
    }
  }
  return win;
}

function gameOver(win){
    console.log("runs");
    for(let index of winCombos[win.index]){
        document.getElementById(index).style.backgroundColor = 
        win.player == player1 ? "#00FFFF": "red";
    }

    for(var i=0; i<cells.length;i++){
        cells[i].removeEventListener('click', turnClick, false);
    } 
   /* declareWinner(win.player == player1 ?  "You won!" : "You Lost") */
}

/*
function declareWinner(who){
    var a = "block";
    document.getElementsByClassName(".endgame").style.display = a;
    document.getElementByClassName(".endgame .text").innerText = who;
}*/
function emptySquares(){
    return boardBlocks.filter(s => typeof s == 'number');
}

function bestSpot(){
    return minimax(boardBlocks, aiplayer).index;
}

function checkTie() {
    if(emptySquares().length == 0){
        for(var i=0; i<cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false)
        }
        /*declareWinner("Tie game!");*/
        return true;
    }
    return false;
}

function minimax(newBoard, player){
    var availspots = emptySquares(newBoard);

    if(checkWin(newBoard,player1)){
        return {score: -10};
    }
    else if(checkWin(newBoard, aiplayer)){
        return {score: 10};
    }
    else if(availspots.length === 0){
        return {score: 0};
    }
    var moves = [];
    for(var i=0; i< availspots.length; i++){
        var move = {};
        move.index = newBoard[availspots[i]];
        newBoard[availspots[i]] = player;

        if(player == aiplayer){
            var result = minimax(newBoard, player1);
            move.score = result.score;
        } 
        else{
            var result = minimax(newBoard, aiplayer);
            move.score = result.score;
        }
        newBoard[availspots[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if(player === aiplayer){
        var bestScore = -10000;
        for(var i=0; i< moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else{
        var bestScore = 10000;
        for(var i=0; i< moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function refresh(){
    location.reload(true);
}





