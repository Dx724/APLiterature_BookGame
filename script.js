var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

const SIDE_LEN = 800;
const FALL_SPEED = 2;

var mousePos = [0, 0];

function updateMRange(iPos, bObj) {
	var tPos = iPos + (bObj.speed * bObj.dir);
	if (tPos > bObj.max) {
		tPos = bObj.max - (tPos - bObj.max);
		bObj.dir *= -1;
	}
	else if (tPos < bObj.min) {
		tPos = bObj.min + (bObj.min - tPos);
		bObj.dir *= -1;
	}
	return tPos;
}

var playerObj = {
	xPos: 0,
	yPos: 650,
	size: 25,
	vBounce: {
		min: 650,
		max: 675,
		speed: 0.05,
		dir: 1
	},
	tick: function() {
		this.move();
	},
	move: function() {
		this.xPos = mousePos[0];
		this.yPos = updateMRange(this.yPos, this.vBounce);
	},
	draw: function() {
		ctx.fillStyle = "black";
		ctx.fillRect(this.xPos - this.size, this.yPos - this.size, this.size, this.size);
	}
};

var scoreObj = {
	yPos: 600,
	sector: 0,
	tick: function() {
		this.sector = Math.floor(playerObj.xPos / (SIDE_LEN / 3));
		if (this.sector == 3) this.sector = 2;
	},
	draw: function() {
		ctx.fillStyle = "red";
		ctx.fillRect(0, this.yPos, SIDE_LEN, 3);
	}
};



var uiObj = { //Drawn after oList objects
	width: w = 250,
	height: h = 75,
	xPos: SIDE_LEN - w,
	yPos: SIDE_LEN - h,
	score: 0,
	score_row: 15,
	draw: function() {
		ctx.fillStyle = "black";
		ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + this.score, this.xPos + this.width / 2, this.yPos + this.height / 2, this.width);
	}
}

var oList = []; //Set this in restart();

var books = ["Jane Eyre", "Crime and Punishment", "Oedipus Rex", "Beowulf", "Hamlet", "Gulliver's Travels", "Candide", "Frankenstein", "Moby Dick", "The Odyssey", "Hedda Gabler", "The Sun Also Rises", "The Stranger", "1984", "White Noise", "Things Fall Apart", "The Things They Carried", "One Flew over the Cuckoo's Nest"];

var quotes = [
				["Mastercard", 14]
				];

function randomElem(selList) {
	return selList[Math.floor(Math.random() * selList.length)];
}

function ChallengeRow() {
	this.quote = randomElem(quotes);
	this.rightAnswer = Math.floor(Math.random() * 3);
	this.blocks = [randomElem(books), randomElem(books), randomElem(books)];
	var rightTitle = books[this.quote[1]];
	this.blocks[this.rightAnswer] = rightTitle;
	for (var i = 0; i < this.blocks.length; i++) {
		if (i != this.rightAnswer) {
			while (this.blocks[i] == this.rightTitle || (this.blocks[i] == this.blocks[0] && i != 0) || (this.blocks[i] == this.blocks[1] && i != 1) || (this.blocks[i] == this.blocks[2] && i != 2)) {
				this.blocks[i] = randomElem(books);
			}
		}
	}
	this.thickness = 55;
	this.yPos = this.thickness * -2; //Top of rectangle
	this.tick = function() {
		this.yPos += FALL_SPEED;
		if (this.yPos > scoreObj.yPos) {
			if (scoreObj.sector == this.rightAnswer) {
				uiObj.score += uiObj.score_row;
			}
			else {
				flag_gameOver = true;
			}
			oList.splice(oList.indexOf(this), 1);
		}
	};
	this.draw = function() {
		ctx.fillStyle = "black";
		ctx.fillRect(0, this.yPos, SIDE_LEN / 3, this.thickness);
		ctx.fillRect(SIDE_LEN / 3 * 2, this.yPos, SIDE_LEN / 3, this.thickness);
		ctx.fillStyle = "#565656";
		ctx.fillRect(SIDE_LEN / 3, this.yPos, SIDE_LEN / 3, this.thickness);

		ctx.fillStyle = "#cecece";
		ctx.fillRect(0, this.yPos - this.thickness, SIDE_LEN, this.thickness);

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "white";
		ctx.font = "bold 15px sans-serif";
		for (var i = 0; i < this.blocks.length; i++) {
			ctx.fillText(this.blocks[i], SIDE_LEN * (1/6 + 1/3 * i), this.yPos + this.thickness / 2, SIDE_LEN / 3);
		}

		ctx.fillStyle = "black";
		ctx.fillText("\"" + this.quote[0] + "\"", SIDE_LEN / 2, this.yPos - this.thickness / 2, SIDE_LEN);
	};
	oList.push(this);
}

canvas.addEventListener("mousemove", function(evt) {
	mousePos = [evt.offsetX / canvas.offsetWidth * SIDE_LEN, evt.offsetY / canvas.offsetWidth * SIDE_LEN];
});

canvas.addEventListener("click", function(evt) {
	if (flag_gameOver) restart();
});

rInterval1 = 0;
rInterval2 = 0;

var flag_gameOver = false;

function gameOver() {
	window.clearInterval(rInterval1);
	window.clearInterval(rInterval2);
	ctx.fillStyle = "black";
	ctx.fillRect(SIDE_LEN / 6, SIDE_LEN / 6, SIDE_LEN / 6 * 4, SIDE_LEN / 6 * 4);
	ctx.font = "55px bold sans-serif";
	ctx.fillStyle = "white";
	ctx.fillText("Game Over", SIDE_LEN / 2, SIDE_LEN / 2 - SIDE_LEN / 24, SIDE_LEN);
	ctx.font = "35px bold sans-serif";
	ctx.fillText("Click to start again!", SIDE_LEN / 2, SIDE_LEN / 2 + SIDE_LEN / 24, SIDE_LEN);
}

function restart() {
	oList = [playerObj, scoreObj];
	flag_gameOver = false;
	scoreObj.score = 0;
	rInterval1 = window.setInterval(runTick, 1/30 * 1000);
	rInterval2 = window.setInterval(generateAdversary, (SIDE_LEN / (FALL_SPEED) / 3) * (1/30 * 1000));
	generateAdversary();
}

ctx.fillStyle = "white";
ctx.fillRect(0, 0, SIDE_LEN, SIDE_LEN);

function runTick() {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, SIDE_LEN, SIDE_LEN);
	
	for (var tObj of oList) {
		tObj.tick();
	}

	if (flag_gameOver) {
		gameOver();
		return;
	}

	for (var tObj of oList) {
		tObj.draw();
	}
	uiObj.draw();
}

function generateAdversary() {
	new ChallengeRow();
}

restart();
