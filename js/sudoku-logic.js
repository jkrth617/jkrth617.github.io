function Sudoku(boardString){
  var self = this;
  this.blankSpace = '-';
  var stringBoard = boardString.split("");
  var counter = 0;
  //turn the lower things into a method call
  this.board = _.map(stringBoard, function(cell){
    if (cell !== self.blankSpace){
      counter ++;
      return {index: counter-1, value: (cell - 0)};
    }else{
      counter ++;
      return {index: counter-1, value: cell};
    } 
  })
  this.numbers = _.range(1, 10);
}

Sudoku.prototype.solveGame = function () {
  console.log(this.to_s(this.board));
  return this.solver(0);
};

Sudoku.prototype.solver = function (depth) {
  var self = this;
  if (self.isValid() === false){
    return false;
  }
  if (self.isSolved() === true && self.isValid() === true ){
    console.log(self.to_s(self.board));
    return self.board;
  }
  var workingCell = self.getCellWithLowestChoices();
  var found = false;
  for(var i = 0; i < workingCell.guesses.length; i++){
    self.board[workingCell.position].value = workingCell.guesses[i];
    var recursiveSolveBoard = self.solver(depth++);
    if (recursiveSolveBoard !== false){
      return recursiveSolveBoard;
    }
    self.board[workingCell.position].value = self.blankSpace;    
  }
  return false;
}

Sudoku.prototype.isValid = function () {
  var self = this;
  var valid = true;
  [0,1,2,3,4,5,6,7,8].forEach(function(i){
    var row = _.groupBy(self.board, function(cell){ 
      return Math.floor(cell.index/9); 
    })[i];
    var col = _.groupBy(self.board, function(cell){ 
      return Math.floor(cell.index%9); 
    })[i];
    var box = _.groupBy(self.board, function(cell){ 
      return self.boxConverter(cell.index); 
    })[i];
    row = _.without(self.getValues(row), self.blankSpace)
    col = _.without(self.getValues(col), self.blankSpace)
    box = _.without(self.getValues(box), self.blankSpace)
    if (!self.validCheck(row) || !self.validCheck(col) || !self.validCheck(box)){
      valid = false;
    };
  });
  return valid;
};

Sudoku.prototype.validCheck = function (arr) {
  var origanalLength = arr.length;
  var dupFreeLength = _.uniq(arr).length;
  return origanalLength === dupFreeLength;
};

Sudoku.prototype.isSolved = function () {
  var self = this;
  var values = _.map(self.board,(function(cell){return cell.value;}));
  return !(_.contains(values, self.blankSpace));
};

Sudoku.prototype.getCellWithLowestChoices = function () {
  var self = this;
  var choices = [];
  self.board.forEach(function(cell, i){
    if (cell.value === self.blankSpace){
      var possibilities = {};
      possibilities.position = i;
      possibilities.guesses = self.getPossibilites(i);
      possibilities.amount = possibilities.guesses.length;
      choices.push(possibilities);
    }
  })
  var s = _.sortBy(choices, 'amount')
  return (_.sortBy(choices, 'amount'))[0];//sort it and return the first one
}

Sudoku.prototype.getPossibilites = function (index){
  return _.difference(this.numbers, this.allNumbersTakenHere(index))
}

Sudoku.prototype.allNumbersTakenHere = function (index){
  return _.union(this.takenInRow(index), this.takenInCol(index),this.takenInBox(index))
}

Sudoku.prototype.takenInRow = function (index){
  var self = this;
  var rowedArray = _.groupBy(self.board, function(cell){ return Math.floor(Math.floor(cell.index/9)); });
  return _.without(self.getValues(rowedArray[Math.floor(index/9)]), self.blankSpace);
}

Sudoku.prototype.takenInCol = function (index){
  var self = this;
  var colledArray = _.groupBy(self.board, function(cell){ return Math.floor(cell.index%9); });
  return _.without(self.getValues(colledArray[index%9]), this.blankSpace);
}

Sudoku.prototype.takenInBox = function (index){
  var self = this;
  var boxedArray = _.groupBy(this.board, function(cell){
    return self.boxConverter(cell.index); 
  });
  return _.without(self.getValues(boxedArray[self.boxConverter(index)]), self.blankSpace)
}

Sudoku.prototype.boxConverter = function (num) {
  var leftSide = Math.floor(num/3)%3;
  var rightSide = Math.floor(Math.floor(num/9)/3)*3
  return rightSide + leftSide
};

Sudoku.prototype.to_s = function (board) {
  var self = this;
  var rowedArray = _.groupBy(board, function(cell){ return Math.floor(cell.index/9); });
  var x = _.values(rowedArray)
  x = _.map(x, (function(row){
    row = _.map(row, function(obj){return obj.value;})
    return row.join(" | ")
  }));
  return x.join("\n");
};

Sudoku.prototype.getValues = function (arr) {
  return _.map(arr, function (cell) {
    return cell.value;
  })
};




var s = new Sudoku("8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--")





$(document).on('ready', function () {
  $('#solve').on('click', function (e) {
    var myData = $('form').serialize();
    var boardString = getValue(myData);
    var sudokuGame = new Sudoku(boardString);
    var answerArray = sudokuGame.solveGame();
    if (answerArray) {
      $('#error').hide();
      fillInBoard(answerArray);
    }else {
      $('#error').show();
    }
  })

  $('#clear').on('click', clearForm)
})

var validInputs = _.map(_.range(1, 10), function (num) {return num+""} )

var getValue = function (bigString) {
  var valueArray = bigString.split("&");
  valueArray = _.map(valueArray, function (input) {
    var breakIndex = input.indexOf("=");
    var cell = input.substring(breakIndex+1);
    if (cell === "" || !_.contains(validInputs, cell)) {cell = "-";}
   return cell;
  })
  return valueArray.join("")
};

var fillInBoard = function (answer) {
  for(var i = 0; i < answer.length; i++){
    $('#cell'+ answer[i].index).val(answer[i].value);
  }
};

var clearForm = function () {
  for(var i = 0; i < 81; i++){
    $('#cell'+i).val("");
  }
};







