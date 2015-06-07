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
			//var lastIndex = (this.snakeBlocks.length) - 1;
			var tempElement = this.snakeBlocks[0]; //head element
			var nextXCoord = tempElement.getX() + this.currDirection[0];
			var nextYCoord = tempElement.getY() + this.currDirection[1];
			var nextElement = new Element(nextXCoord, nextYCoord);
			this.snakeBlocks.pop();
			this.snakeBlocks.unshift(nextElement);
		};
	}
	Snake.prototype = new Element(); //Inherit Elements functions, especially isSamePos
	Snake.prototype.constructor = Snake; //To make sure I get Snake when I ask how I created it

	//not in use yet
	function isOutside(snakeHead){//give it first element of playerSnake.snakeBlocks
		return snakeHead.getX() > maximalX || snakeHead.getX() < 0 || snakeHead.getY() > maximalY ||
		snakeHead.getY() < 0;
	}
	//Basic game functions
	function spawnElement(){ //right now can spawn on the snake, FIX LATER
		var xCoord = Math.floor(Math.random() * (window.innerWidth/(2*cellSize)));
		var yCoord = Math.floor(Math.random() * (window.innerHeight/(2*cellSize)));
		var newBlock = new Element(xCoord, yCoord);
		blocks.push(newBlock);
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
			}
		}
	}

	function update(){
		if(isOutside(playerSnake.snakeBlocks[0])){
			alert("You lost, RIP");//temporary, should pause the game later
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

	return{
		start: startGame

	};


}());