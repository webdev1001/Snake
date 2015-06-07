var snakeGame = (function(){
	/**
		List of TODO:s
		

		Snake movement: have an array, push elements to it when picked up
		Otherwise, pop last element, push to next position = simulates moving
		Loop through the whole snake array consisting of elements, 
		draw snake at x and y positions.

		have a getNextPos in snake

		have a gameTick, move each gameTick, spawn items in an interval, 
		or when there are no blocks on the board.

		Spawning blocks/elements
		
		Make snake eat elements
		Check collision with yourself
		Check collision when spawning new elements
		
		Use arrays splice method when removing from blocks array

		update each 300-500 ms -ish

		Last thing to do: clean up code, no repitions
		no long chains

		update bounds of the window each time it resizes
		if head is outside those bound = lose

	*/

	var running = false;
	var blocks = [];
	var maximalY;
	var maximalX;
	var updateInterval;
	var spawnInterval;

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


	//Snake is a bit more than just an element
	function Snake(){
		//spawns middle of the screen and goes north as default
		var head = new Element(Math.floor(window.innerWidth/2), Math.floor(window.innerHeight/2));
		var startEl2 = new Element(Math.floor(window.innerWidth/2) + 1, Math.floor(window.innerHeight/2));
		var startEl3 = new Element(Math.floor(window.innerWidth/2) + 2, Math.floor(window.innerHeight/2));

		this.snakeBlocks = [startEl3, startEl2, head];

		for (var i = 0; i < this.snakeBlocks.length; i++) {
			//console.log("Inside snake constructor, length of snake is " + 
				//this.snakeBlocks.length);
			console.log("X position is " + this.snakeBlocks[i].getX() + 
				" and Y pos is " + this.snakeBlocks[i].getY());
		}
		this.currLength = this.snakeBlocks.length;
		this.currDirection = Directions.NORTH;

		this.switchDirection = function(newDirection){
			this.currDirection = newDirection;
		};
		this.moveSnake = function(){
			var lastIndex = (this.snakeBlocks.length) - 1;
			var tempElement = this.snakeBlocks[lastIndex]; //head element
			var nextXCoord = tempElement.getX() + this.currDirection[0];
			var nextYCoord = tempElement.getY() + this.currDirection[1];
			console.log("Next X coord is " + nextXCoord + " next Y is " + nextYCoord);
			var nextElement = new Element(nextXCoord, nextYCoord);
			this.snakeBlocks.pop();
			console.log("I should have popped it " + this.snakeBlocks.length);
			this.snakeBlocks.push(nextElement);
			console.log("I should have pushed it " + this.snakeBlocks.length);
		};
	}
	Snake.prototype = new Element(); //Inherit Elements functions, especially isSamePos
	Snake.prototype.constructor = Snake; //To make sure I get Snake when I ask how I created it


	function isOutside(snakeHead){
		return snakeHead[0] > maximalX || snakeHead[0] < 0 || snakeHead[1] > maximalY ||
		snakeHead[1] < 0;
	}
	//Basic game functions
	function spawnElement(){ //right now can spawn on the snake, FIX LATER
		var xCoord = Math.floor(Math.random()* window.innerWidth);
		var yCoord = Math.floor(Math.random()* window.innerHeight);
		var newBlock = new Element(xCoord, yCoord);
		blocks.push(newBlock);
	}

	function pickElements(){
		for (var i = 0; i < blocks.length; i++) {
			var head = playerSnake.snakeBlocks[playerSnake.snakeBlocks.length-1];
			if(blocks[i].isSamePos(head)){
				var tail = playerSnake.snakeBlocks[0];
				var nextXCoord = tail.getX() - playerSnake.currDirection[0];
				var nextYCoord = tail.getY() - playerSnake.currDirection[1];
				var nextElement = new Element(nextXCoord, nextYCoord);
				playerSnake.snakeBlocks.push(nextElement);
				blocks.splice(i, 1); //remove from blocks
			}
		}
	}

	function update(){
		drawOnCanvas();
		playerSnake.moveSnake();
		pickElements();
		if(blocks.length === 0){ //incase player picked up every
			spawnElement();
		}
		
	}

	function run(){
		if(running){
			updateInterval = window.setInterval(update, 10); //do I have to do this on document?
			spawnInterval = window.setInterval(spawnElement, 10000); //spawn each 2 seconds
		}
	}

	function keyDownHandler(e){//add to window.onkeydown later
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

		for (var i = 0; i < playerSnake.snakeBlocks.length; i++) {
			console.log("Inside drawcanvas, length of snake is " + 
				playerSnake.snakeBlocks.length);
			console.log("X position is " + playerSnake.snakeBlocks[i].getX() + 
				" and Y pos is " + playerSnake.snakeBlocks[i].getY());
			ctx.fillRect(Math.floor(playerSnake.snakeBlocks[i].getX()), 
				Math.floor(playerSnake.snakeBlocks[i].getY()), 20, 20);
		}
		
		for (var i = 0; i < blocks.length; i++) {
			console.log("Inside drawcanvas, amount of blocks is " + 
				blocks.length);
			ctx.fillRect(blocks[i].getX(), 
				blocks[i].getY(), 20, 20);
		};
		
	}

	function startGame(){
		running = true;
		playerSnake = new Snake(); //global snake for this

		window.onkeydown = keyDownHandler;
		//window.onresize = updateBounds;
		setUpCanvas();
		//initiate stuff here
		run();
	}

	function stopGame(){
		running = false;
		clearInterval(updateInterval);
		clearInterval(spawnInterval);
	}

	return{
		start: startGame

	};


}());