var STARTINGX = 650;
var STARTINGY = 289;

                                    //controller
var Contlr = function Contlr () {
  this.game = new Game;
  this.view = new View;
  this.view.contlr = this;
  this.game.contlr = this;
  this.frameRate = 250;//1/4 a second
  this.startGame();
};

Contlr.prototype.startGame = function () {
  var self = this;
  self.view.placeAliensOnPage(self.game.army);
  self.view.placeShipOnPage(self.game.ship);

  intValAliens = setInterval(function () {
    self.game.updateAliens();
    self.frameRate-=20
  }, self.frameRate)

  intValBullets = setInterval(function () {
    self.game.updatebullets();
    self.game.checkCollisions();
    self.view.drawFrame(self.game);
    self.game.resetGY();
    var turnEnd = self.isGameOver();
    if (turnEnd.bool){
      self.view.gameOverDisplay(turnEnd.output)
      clearInterval(intValAliens);
      clearInterval(intValBullets);
    }
  }, self.frameRate/2.5)

};

Contlr.prototype.isGameOver = function () {
  var answer = false;
  var message;
  if(this.game.army.length === 0){
    answer = true;
    message = "ALIENS HAVE BEEN DESTROYED"
  }
  else if(this.game.isShipHit()){
    answer = true;
    message = "ALIENS HAVE INVADED";
  }
  return {bool: answer, output: message};
};

Contlr.prototype.moveShip = function (modifyer) {
  this.game.shiftShip(modifyer);
  this.view.drawShip(this.game.ship.xpos);
};
Contlr.prototype.shoot = function () {
    var newBullet = this.game.makeBullet();
    this.view.drawBullet(newBullet);
};

                                    //Game
var Game = function Game () {
  this.contlr;
  alienCounter = 0;//no var so it is now a sudo global
  bulletCount = 0;//no var so it is now a sudo global
  this.ship = new Ship; 
  this.shifter = 20;
  this.counter = 0;
  this.boundry = 20;
  this.enemyCount = 80;
  this.army = this.alienSetUp();
  this.graveYard = {deadAliens: [], deadBullets: []};
  this.bullets = [];
};

Game.prototype.checkCollisions = function () {// this function should be refactored
  var self = this;
  for(var i = 0; i < self.bullets.length; i++){
    var bullet = self.bullets[i];
    var xKill = bullet.xpos;
    var yKill = bullet.ypos;
    for(var j = 0; j < self.army.length; j++){
      var alien = self.army[j];
      if(self.comparePositions(alien.xpos,xKill, 10) && self.comparePositions(alien.ypos, yKill)){
        var killA = self.army.indexOf(alien);
        var killB = self.bullets.indexOf(bullet);
        self.graveYard.deadAliens.push(self.army[killA])
        self.graveYard.deadBullets.push(self.bullets[killB])
        self.army.splice([killA],1);
        self.bullets.splice([killB],1);
        //extract this behavior into its own function to DRY code out
        i--;
        break;
      } 
    }
  }
};

Game.prototype.isShipHit = function () {
  for(var i = 0; i< this.army.length; i++){
    var alien = this.army[i];
    if(this.comparePositions(alien.xpos, this.ship.xpos) && this.comparePositions(alien.ypos, this.ship.ypos, 8)){
      return true;
    }
  }
  return false;
};

Game.prototype.comparePositions = function(x, target, leeway) {
  if(leeway==undefined){
    var leeway = 10;
  }
  return x >= target-leeway && x <= target+leeway;
}

Game.prototype.updatebullets = function () {
  var self = this;
  self.bullets.forEach(function (bullet) {
    bullet.ypos -= Math.abs(self.shifter);
    if(bullet.ypos < 0){
      self.graveYard.deadBullets.push(bullet)
      var killB = self.bullets.indexOf(bullet);
      self.bullets.splice([killB],1);//WET
    }
  })
};

Game.prototype.updateAliens = function () {
  var self = this
  if(self.counter% self.boundry == 0 && self.counter != 0){
    self.army.forEach(function (alien) {
      alien.ypos += Math.abs(self.shifter);
    })
    self.shifter *= -1; 
  }
  else{
    self.army.forEach(function (alien) {
      alien.xpos += self.shifter;
    })
  }
  self.counter ++;
};

Game.prototype.alienSetUp = function () {
  var army = [];
  for(var i = 0; i < this.enemyCount; i++){
    army.push(new Alien);
  }
  return army;
}; 

Game.prototype.shiftShip = function (mod) {
  this.ship.xpos += Math.abs(this.shifter)*mod
};

Game.prototype.makeBullet = function () {
    var newBullet = new Bullet();
    newBullet.xpos = this.ship.xpos;
    newBullet.ypos = this.ship.ypos;
    this.bullets.push(newBullet);
    return newBullet;
};

Game.prototype.resetGY = function () {
  this.graveYard.deadAliens = [];
  this.graveYard.deadbullets = [];
};

                                    //view
var View = function View () {
  this.contlr;
  this.$armyContainer = $('#invading-army');
  this.$ship = $('#space-ship');
};

View.prototype.drawFrame = function (game) {
  this.updateAlienPositions(game.army);
  this.updateBulletPosions(game.bullets);
  this.removeGraveYard(game.graveYard);
};

View.prototype.gameOverDisplay = function (message) {
  $("#in-game-message").text(message);
};

View.prototype.removeGraveYard = function (graveYard) {
//GY is in obj with deadAliens and dead Bullets
  graveYard.deadAliens.forEach(function(alien){
    $("#alien"+alien.id).remove();
  })
  graveYard.deadBullets.forEach(function(bullet){
    $("#bullet"+bullet.id).remove();
  })
};

View.prototype.placeAliensOnPage = function (army) {
  var self = this;
  army.forEach(function(alien){
    self.$armyContainer.append(alien.content);
    $('#invading-army #alien'+alien.id).css("left", "+="+alien.xpos);
    $('#invading-army #alien'+alien.id).css("top", "+="+alien.ypos);    
  })
};

View.prototype.placeShipOnPage = function (ship) {
  this.$ship.css({"left": "+="+ship.xPosition, "top": "+="+ship.yPosition});    
};

View.prototype.updateAlienPositions = function (army) {
  army.forEach(function(alien){
    $('#invading-army #alien'+alien.id).css("left", alien.xpos+"px");
    $('#invading-army #alien'+alien.id).css("top", alien.ypos+"px"); 
  }) 
};

View.prototype.drawBullet = function (bullet) {
  this.$ship.before(bullet.content);
  $('#bullet'+bullet.id).css('top', bullet.ypos+"px")
  $('#bullet'+bullet.id).css('left', bullet.xpos+"px")
};

View.prototype.updateBulletPosions = function (bullets) {  
  bullets.forEach(function(bullet){
    $('#bullet'+bullet.id).css("top", bullet.ypos+"px");  
  })
};

View.prototype.drawShip = function (pos) {
  this.$ship.css({"left": pos+"px"})
};

                                //SHIP

var Ship = function Ship () {
  this.xpos = STARTINGX;
  this.ypos = STARTINGY;
};

                                  //ALIEN

var Alien = function Alien () {
  this.id = alienCounter;
  alienCounter++;
  this.content = "<span id = alien"+this.id+" class='alien'>W</span>";
  this.xpos = this.calcXpos(this.id);
  this.ypos = this.calcYpos(this.id);
};

Alien.prototype.calcXpos = function(id) {
  var row = id%20;
  return 25 * row;
};

Alien.prototype.calcYpos = function(id) {
  var col = Math.floor(id/20);
  return 25 * col;
};

                                  //BULLET
var Bullet = function Bullet () {
  this.id = bulletCount;
  bulletCount++;
  this.content = "<span id = bullet"+this.id+" class='bullet'>|</span>";
  this.xpos;
  this.ypos;
};

                                  //listeners
$(document).on('ready', function (e) {
  c = new Contlr;
  $(document).keydown(function(e) {
    e.preventDefault(); 
    switch(e.which) {
      case 37: // left
        console.log("left")
        c.moveShip(-1);
      break;

      case 39: // right
        console.log("right")
        c.moveShip(1);
      break;

      case 32:
        console.log("shoot")
        c.shoot();
      break

      case 80:
        alert("Game is paused, press 'p' to resume")
        debugger;
      break;

      default: return;
    }
  });
});