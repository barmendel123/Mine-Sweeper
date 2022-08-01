'use strict'
const MIN_BOARD_NUM = 1
const MAX_BOARD_NUM = 99

//Cells

function getEmptyCells() {
  var emptyCellsArr = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (!gBoard[i][j].isMine) 
        emptyCellsArr.push({ i, j })
    }
  }
  return emptyCellsArr
}

function drawEmptyCell() {
    var emptyCells = getEmptyCells()
    var emptyCell = emptyCells.splice(getRandomInt(0, emptyCells.length-1), 1)
    return emptyCell[0]
  }
  
// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}



function getClassName(location) {
    var cells = `cell-${location.i}-${location.j}`
    return cells
  }

//Random funcs
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
    //The maximum is inclusive and the minimum is inclusive
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createRandID() {

    var id = ''
    for (var i = 0; i < 7; i++) {
        var randNum = Math.floor(Math.random() * 10)
        id += randNum
    }
    console.log('id:', id)
    return id
}

function drawNum(nums) {
    var randIdx = getRandomInt(0, nums.length-1)
    var res = gNums[randIdx]
    gNums.splice(randIdx, 1)
    return res
}

function resetNums() {
    gNums = []
    for (var i = MIN_BOARD_NUM; i <= MAX_BOARD_NUM; i++) {
        gNums.push(i)
    }
}

//Matrix funcs
function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function printMat(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


function sumCol(mat, colIdx) {
    var sum = 0
    for (var i = 0; i < mat.length; i++) {
        sum += mat[i][colIdx]
    }
    return sum
}

function sumRow(mat, rowIdx) {
    var sum = 0
    for (var i = 0; i < mat[rowIdx].length; i++) {
        sum += mat[rowIdx][i]
    }
    return sum
}

function sumDiagonal(mat){
    var sum = 0

    for (var i = 0; i < mat.length; i++) {
        sum += mat[i][i]
    }
    console.log('main diagonal sum = ', sum)
    return sum
}

function sumSecondDiagonal(mat){
    
    var sum = 0
    for (var i = 0; i < mat.length; i++) {
        sum += mat[i][mat.length-1-i]   
    }
    console.log('second diagonal sum = ', sum)
    return sum
}

function findMax(mat, colIdx) {
    
    var maxNum = -Infinity
    for (var i = 0; i < mat.length; i++) {

        for (var j = 0; j < mat[i].length; j++) {
           if (mat[i][j] > maxNum) maxNum = mat[i][j]
        }   
    }
    return maxNum
}

function findAvg(mat) {
    var totalSum = 0
    var count = 0
    for (let i = 0; i < mat.length; i++) {
        totalSum += sumRow(mat, i)
        console.log('Total sum of Row num', (i) , totalSum, 'row length ', mat[i].length )
        count += mat[i].length
    }
    var average = totalSum / count
    return parseFloat(average).toFixed(2)
}


function sumArea(mat, rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd) {
    var sum = 0 
    for (var i = rowIdxStart; i <= rowIdxEnd ; i++) {
            
        for (var j = colIdxStart; j <= colIdxEnd ; j++) {
            sum += mat[i][j]
        }
    }
    return sum
}

//Sort funcs
function sortStudentsByName(students){

    students.sort(( s1 , s2 ) => {return s1.studentName.localeCompare(s2.studentName)})
}

function sortStudentsByGrade(students){

    students.sort(( s1 , s2 ) => {return calcAveragePerStudent(s1) - calcAveragePerStudent(s2)})
}