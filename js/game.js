'use strict'
const SIZE = 4
var gBoard
const MINE = '💩'
const FLAG = '🚩'
const WIN = '😍'
const LOST = '😭'
const REGULAR = '😊'
const HEARTH = '❤️'

var gGame
var gLevel
var gTime = 0
var timeInterval
var firstClick
var gScore
var gMines
var gFlugs
var gFirstTime


var elSec = document.querySelector('.timer')
var elLives = document.querySelector('.lives')
var elSmiley = document.querySelector('.smily')
var elScore = document.querySelector('.score')
var elMsg = document.querySelector('.msg')
var elFlugs = document.querySelector('.flags')

function init(size = 8) {
    gTime = 0
    gScore = 0
    gFirstTime = true
    gLevel = {
        SIZE: size,
        MINES: getNumOfMines(size)
    }
     gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        lives: 3
    }
    if(gLevel.MINES === 2){
        gGame.lives = 2
        elLives.innerText = '❤️❤️'
    }else elLives.innerText = '❤️❤️❤️'

    elSmiley.innerText = REGULAR
    gMines = gLevel.MINES
    gFlugs = gLevel.MINES

    clearInterval(timeInterval)
    gBoard = buildBoard()
    renderBoard(gBoard)
    elSec.innerHTML = 'Time: ' + gTime
    elScore.innerText = 'Score: ' + gScore
    elMsg.innerText = ' '
    elFlugs.innerText = FLAG + ' Flugs left: ' + gFlugs
}

function buildBoard() {
    var board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            var oneCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isFlagged: false,
            }
            board[i][j] = oneCell
        }
    }
    return board
}

function neighborsCounter(board, rowIndex, colIndex){ // neighbors loop
    var counterNeighborsMine = 0
    for(var i = rowIndex - 1 ; i <= rowIndex + 1; i++){
        if(i < 0 || i > board.length - 1 ) continue // out of mat rows

        for(var j = colIndex - 1 ; j <= colIndex + 1 ; j++ ){
            if(i === rowIndex && j === colIndex) continue // the cell himself
            if(j < 0 || j > board[i].length - 1 ) continue // out of mat cols
            if(board[i][j].isMine)
                counterNeighborsMine++
        }
    }
    return counterNeighborsMine
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) { 
            var cellInfo = getClassName({ i, j })
            var cell = board[i][j]

            strHTML += `\t<td class="cell ${cellInfo}"
                              onmouseup="cellClicked(this, ${i}, ${j}, event)"
                              >`

            if(cell.isShown ){
                
                if(cell.isMine && !cell.isMarked)
                    strHTML += MINE
                if(!cell.isMine && !cell.isMarked) {
                    
                    strHTML += cell.minesAroundCount
                }    
                else if(cell.isMarked && cell.isFlagged) 
                    strHTML += FLAG 

            }  

            
            strHTML += `</td> \n` 
        }
        strHTML += '</tr>\n'
    }    
    var elTable = document.querySelector('.board-container')
    elTable.innerHTML = strHTML
}

function cellClicked(elCell, i, j, event) {
    if(!gGame.isOn && gFirstTime){
        toSetRandomMines(i,j)
        setMinesNegsCount(gBoard)
        gTime = 0
        gGame.isOn = true
        gFirstTime = false
        timeInterval = setInterval(timeUp, 1000)
    }

    if(!gGame.isOn && !gFirstTime) return
    var clickedCell = gBoard[i][j]

    if (event.button === 2) {
        if(clickedCell.isFlagged && clickedCell.isShown &&  clickedCell.isMarked){
            console.log('step 1');
            clickedCell.isShown = !clickedCell.isShown
            clickedCell.isMarked = !clickedCell.isMarked
            clickedCell.isFlagged = false
            gFlugs++
            elFlugs.innerText = FLAG + ' Flugs left: ' + gFlugs
            if(clickedCell.isMine){
                gLevel.MINES++
            }
        }
        else if(gFlugs && !clickedCell.isFlagged && !clickedCell.isShown){
            console.log('step 2');
            clickedCell.isShown = !clickedCell.isShown
            clickedCell.isMarked = !clickedCell.isMarked
            gLevel.markedCount++
            gFlugs--
            clickedCell.isFlagged = true
            gLevel.markedCount++

            elFlugs.innerText = FLAG + ' Flugs left: ' + gFlugs

            if (clickedCell.isMarked && clickedCell.isMine) gLevel.MINES--
        }
    }    
    else if(event.button === 0){
        if(clickedCell.isShown ) return
        if(clickedCell.isMarked) return
        clickedCell.isShown = true
        
        if(clickedCell.isMine){
            gGame.lives--
            gLevel.MINES--

            renderLives() 
        }else{
            gScore++
            elScore.innerText = 'Score: ' + gScore
        }
        if(clickedCell.minesAroundCount === 0 && !clickedCell.isMine){
            expandShown(gBoard, elCell, i, j)  
        }
    }
    //console.log(elCell);
   
    checkGameOver() 
    
    renderBoard(gBoard)
}

function toSetRandomMines(clickedI, clickedJ) {
    for (var i = 0; i < gLevel.MINES; i++) {
      var currCell = drawEmptyCell()
      if((clickedI === currCell.i) || (clickedJ === currCell.j) ){
            i--
            continue
        } 
    gBoard[currCell.i][currCell.j].isMine = true
    }
}

  function setMinesNegsCount(board) {
    
    for(var i = 0 ; i < board.length; i++){
        for(var j = 0 ; j < board[i].length; j++){
            if(board[i][j].isMine) continue
            board[i][j].minesAroundCount = neighborsCounter(board, i, j) 
        }  
    }
}

function getNumOfMines(boardSize) {
    switch (boardSize) {
        case 4:
            return 2  
        case 8:
            return 12  
        case 12:
            return 30
    }
    console.log('invalid board size')
    return 0
}

function shownAllMines(){
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0 ; j < gBoard[i].length; j++){
            if(gBoard[i][j].isMine)
                gBoard[i][j].isShown = true    
        }
    }
    renderBoard(gBoard)
}

function timeUp(){
    gTime++
    elSec.innerText = 'Time: ' + gTime
}

function gameOver(){
    console.log('YOU LOST');
    shownAllMines()
    elSmiley.innerText = LOST
    elMsg.innerText = '💩YOU LOST!'
    gGame.isOn = false
    clearInterval(timeInterval)
    gTime = 0
}

function gameWin(){
    console.log('YOU WON');
    elSmiley.innerText = WIN
    elMsg.innerText = '😍YOU WON!!'
    gGame.isOn = false
    clearInterval(timeInterval)
    gTime = 0
}

function checkGameOver() {
    if(gGame.lives !== 0){
       if(gLevel.MINES === 0 ) gameWin()
    }
    if(gGame.lives === 0 ){
        elLives.innerHTML = ' '
        gameOver()
    }
}

function renderLives(){
    console.log('Life left ', gGame.lives);

    if(gGame.lives === 2){
        elLives.innerText = '❤️❤️'
    }
    else if(gGame.lives === 1){
        elLives.innerText = '❤️'
    }
    else if(gGame.lives === 0) {
        elLives.innerHTML = ' '
    }
}

function expandShown(board, elCell, rowIndex, colIndex) {
    for(var i = rowIndex - 1 ; i <= rowIndex +1 ; i++){
        if(i < 0 || i >= board.length) continue // out of mat rows
        for(var j = colIndex - 1 ; j <= colIndex + 1 ; j++ ){
            if(i === rowIndex && j === colIndex) continue // the cell himself
            if(j < 0 || j > board[i].length - 1 ) continue // out of mat cols
            if(!board[i][j].isShown){
                board[i][j].isShown = true
            }
        }
    }
    renderBoard(board)
}


