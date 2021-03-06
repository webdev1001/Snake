var snakeGame = (function(){
	/**
		List of TODO:s
		

		Last thing to do: clean up code, no repitions
		no long chains
	*/

	var running = false;
	var blocks = [];
	var maximalY;
	var maximalX;
	var updateInterval;
	var spawnInterval;
	var elementsPicked = 0;

	var cellSize = 20;

	function updateBounds(){
		maximalX = window.innerWidth;
		maximalY = window.innerHeight;
		setUpCanvas();//test this first
	}

	//make this look like a singleton with possible directions
	//freeze disallows you to add new properties
	var Directions = Object.freeze({
		NORTH: [0, -1], //delta values in that direction
		SOUTH: [0, 1],
		EAST: [1, 0],
		WEST: [-1, 0],
	});
	function isSameDirection(firstDir, secondDir){
		return firstDir[0] === secondDir[0] && firstDir[1] === secondDir[1];
	}
	//creating Element with 2D coordinates, will be used for both spawning blocks
	//and the snake soon
	function Element(xCoord, yCoord){
		this.xCoord = xCoord;
		this.yCoord = yCoord;
	}

	Element.prototype.getX = function() { //Like static methods, no need to make many of them
		return this.xCoord;
	};

	Element.prototype.getY = function() {
		return this.yCoord;
	};

	Element.prototype.isSamePos = function(element){
		return this.getX() === element.getX() && this.getY() === element.getY();
	};
	Element.prototype.toString = function(){
		return "The X is " + this.getX() + " Y is " + this.getY();
	}

	//Snake is a bit more than just an element
	function Snake(){
		//spawns middle of the screen and goes north as default
		var head = new Element(Math.floor((window.innerWidth/(2*cellSize))), Math.floor((window.innerHeight/(2*cellSize))));
		var startEl2 = new Element(Math.floor((window.innerWidth/(2*cellSize))) + 1, Math.floor((window.innerHeight/(2*cellSize))));
		var startEl3 = new Element(Math.floor((window.innerWidth/(2*cellSize))) + 2, Math.floor((window.innerHeight/(2*cellSize))));

		//X's are 28, 29, 30,all y are 35.
		this.snakeBlocks = [head, startEl2, startEl3];
		this.currDirection = Directions.SOUTH;
		//console.log(head + " XXXX" + startEl2 + " XXXX" + startEl3);

		this.switchDirection = function(newDirection){
			this.currDirection = newDirection;
		};
		this.moveSnake = function(){
			var tempElement = this.snakeBlocks[0]; //head element
			var nextXCoord = tempElement.getX() + this.currDirection[0];
			var nextYCoord = tempElement.getY() + this.currDirection[1];
			var nextElement = new Element(nextXCoord, nextYCoord);
			this.snakeBlocks.pop();
			this.snakeBlocks.unshift(nextElement);
		};
		this.getBlocks = function(){
			return this.snakeBlocks;
		}
	}
	//not in use yet
	function isOutside(snakeHead){//give it first element of playerSnake.snakeBlocks
		return snakeHead.getX() > maximalX || snakeHead.getX() < 0 || snakeHead.getY() > maximalY ||
		snakeHead.getY() < 0;
	}
	function isCollidingSnake(snake){
		var snakeblocks = snake.getBlocks();
		var head = snakeblocks[0];
		for (var i = 1; i < snakeblocks.length; i++) {
			if(head.isSamePos(snakeblocks[i])){
				return true;
			}
		}
		return false;
	}
	//Basic game functions
	function spawnElement(){ //right now can spawn on the snake, FIX LATER
		var newBlock;
		do{
			var xCoord = Math.floor(Math.random() * (window.innerWidth/(2*cellSize)));
			var yCoord = Math.floor(Math.random() * (window.innerHeight/(2*cellSize)));
			newBlock = new Element(xCoord, yCoord);
		}while(isElementExist(newBlock));
		
		blocks.push(newBlock);
	}
	function isElementExist(element){
		for (var i = 0; i < blocks.length; i++) {
			if(element.isSamePos(blocks[i])){
				return true;
			}
		}
		return false;
	}
	//can only pick with head 
	function pickElements(){
		for (var i = 0; i < blocks.length; i++) {
			var head = playerSnake.snakeBlocks[0];
			if(blocks[i].isSamePos(head)){
				//console.log("ZING ZING CAUGHT AN ELEMENT MUAHAHA");
				var lastIndex = (playerSnake.snakeBlocks.length) - 1;
				var tail = playerSnake.snakeBlocks[lastIndex];
				var nextXCoord = tail.getX() - playerSnake.currDirection[0];
				var nextYCoord = tail.getY() - playerSnake.currDirection[1];
				var nextElement = new Element(nextXCoord, nextYCoord);
				playerSnake.snakeBlocks.push(nextElement);
				blocks.splice(i, 1); //remove from blocks
				elementsPicked++;
			}
		}
	}

	function update(){
		if(isOutside(playerSnake.snakeBlocks[0]) || isCollidingSnake(playerSnake)){
			stopGame();
			alert("You lost, RIP, but hey, you picked " + elementsPicked + " blocks");//temporary, should pause the game later
		}
		drawOnCanvas();
		playerSnake.moveSnake();
		pickElements();
		if(blocks.length === 0){ //incase player picked up every element
			spawnElement();
		}
		
	}

	function run(){
		if(running){
			updateInterval = window.setInterval(update, 150); 
			spawnInterval = window.setInterval(spawnElement, 3000); //spawn each 3 seconds
		}
	}

	function keyDownHandler(e){//add to window.onkeydown later
		if(running){
			switch(e.keyCode){
				case 37: //left
					if(!isSameDirection(playerSnake.currDirection, Directions.EAST)){
						playerSnake.switchDirection(Directions.WEST);
					}
					break;
				case 38:
					if(!isSameDirection(playerSnake.currDirection, Directions.SOUTH)){
						playerSnake.switchDirection(Directions.NORTH);
					}
					break;
				case 39://right
					if(!isSameDirection(playerSnake.currDirection, Directions.WEST)){
						playerSnake.switchDirection(Directions.EAST);
					}
					break;
				case 40:
					if(!isSameDirection(playerSnake.currDirection, Directions.NORTH)){
						playerSnake.switchDirection(Directions.SOUTH);
					}
					
					break;
			}
		}else {
			switch(e.keyCode){
				case 82: //r letter (for reset)
					resetGame();
					break;
			}
		}
		
	}

	var canvas;
	function setUpCanvas(){
		canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function drawOnCanvas(){
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#09CDDA";//cyan colour for the head
		ctx.fillRect(playerSnake.snakeBlocks[0].getX()*cellSize, playerSnake.snakeBlocks[0].getY()*cellSize, cellSize, cellSize);
		ctx.fillStyle = "#000000";//black colour
		for (var i = 1; i < playerSnake.snakeBlocks.length; i++) {
			ctx.fillRect(Math.floor(playerSnake.snakeBlocks[i].getX())*cellSize, 
				Math.floor(playerSnake.snakeBlocks[i].getY())*cellSize, cellSize, cellSize);
		}
		for (var i = 0; i < blocks.length; i++) {
			ctx.fillRect(Math.floor(blocks[i].getX())*cellSize, 
				Math.floor(blocks[i].getY())*cellSize, cellSize, cellSize);
		};
		
	}
	function startGame(){
		running = true;
		playerSnake = new Snake(); //global snake for this
		updateBounds();
		window.onkeydown = keyDownHandler;
		window.onresize = updateBounds;
		setUpCanvas();
		//initiate stuff here
		run();
	}

	function stopGame(){
		running = false;
		clearInterval(updateInterval);
		clearInterval(spawnInterval);
	}

	function resetGame(){
		stopGame();
		elementsPicked = 0;
		startGame();
	}

	return{
		start: startGame

	};


}());