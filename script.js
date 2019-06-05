var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

const SIDE_LEN = 800;
const FALL_SPEED = 1;

var mousePos = [0, 0];

var img_background = new Image();
img_background.src = "background.png";
var img_caroline = new Image();
img_caroline.src = "CarolineDrawing.png";
var img_hartnett = new Image();
img_hartnett.src = "HartnettDrawing.png";

var actualAnswer = "None";


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

var playerObj = { //Ticks before others, drawn after others
	xPos: 0,
	yPos: 650,
	size: 25,
	vBounce: {
		min: 650,
		max: 660,
		speed: 0.10,
		dir: 1
	},
	image: img_caroline, //Note: image size hard-coded into "draw" function
	width: 709 / 7,
	height: 1518 / 7,
	tick: function() {
		this.move();
	},
	move: function() {
		this.xPos = mousePos[0];
		this.yPos = updateMRange(this.yPos, this.vBounce);
	},
	draw: function() {
		//ctx.fillStyle = "black";
		//ctx.fillRect(this.xPos - this.size, this.yPos - this.size, this.size, this.size);
		ctx.drawImage(this.image, this.xPos - this.width / 2, this.yPos - this.height / 2, this.width, this.height);
	}
};

var scoreObj = {
	yPos: 650 - 150,
	sector: 0,
	tick: function() {
		this.sector = Math.floor(playerObj.xPos / (SIDE_LEN / 3));
		if (this.sector == 3) this.sector = 2;
	},
	draw: function() {
		return;
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
		ctx.font = "25px 'Open Sans', sans-serif"
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + this.score, this.xPos + this.width / 2, this.yPos + this.height / 2, this.width);
	}
}

var oList = []; //Set this in restart();

var books = ["Jane Eyre", "Crime and Punishment", "Oedipus Rex", "Beowulf", "Hamlet", "Gulliver's Travels", "Candide", "Frankenstein", "Moby Dick", "The Odyssey", "Hedda Gabler", "The Sun Also Rises", "The Stranger", "1984", "White Noise", "Things Fall Apart", "The Things They Carried", "One Flew Over the Cuckoo's Nest"];

var quotes = [
				//["Mastercard", 14]
				["I am no bird; and no net ensnares me: I am a free human being with an independent will.", 0],
				["I would always rather be happy than dignified.", 0],
				["Flirting is a woman's trade, one must keep in practice.", 0],
				["Life appears to me too short to be spent in nursing animosity or registering wrongs.", 0],
				["Reader, I married him.", 0],
				["To go wrong in one's own way is better than to go right in someone else's.", 1],
				["The darker the night, the brighter the stars, The deeper the grief, the closer is God!", 1],
				["It takes something more than intelligence to act intelligently.", 1],
				["Taking a new step, uttering a new word, is what people fear most.", 1],
				["Pain and suffering are always inevitable for a large intelligence and a deep heart.", 1],
				["To throw away an honest friend is, as it were, to throw your life away", 2],
				["I have no desire to suffer twice, in reality and then in retrospect.", 2],
				["Time, which sees all things, has found you out.", 2],
				["How dreadful the knowledge of the truth can be When there's no help in truth.", 2],
				["...count no man happy till he dies, free of pain at last.", 2],
				["I shall gain glory or die.", 3],
				["That was their way, their heathenish hope; deep in their hearts they remembered hell.", 3],
				//["Hwæt! Wē Gār-Dena in geār-dagum þēod-cyninga þrym gefrūnon, hū þā æðelingas ellen fremedon.", 3],
				["Behaviour that's admired is the path to power among people everywhere.", 3],
				["Fate will unwind as it must!", 3],
				["There is nothing either good or bad, but thinking makes it so.", 4],
				["Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune", 4],
				["Though this be madness, yet there is method in't.", 4],
				["Brevity is the soul of wit.", 4],
				["Listen to many, speak to a few.", 4],
				["Every man desires to live long, but no man wishes to be old.", 5],
				["...I hid myself between two leaves of sorrel, and there discharged the necessities of nature.", 5],
				["... a wife should be always a reasonable and agreeable companion, because she cannot always be young.", 5],
				["... philosophers are in the right when they tell us that nothing is great or little otherwise than by comparison.", 5],
				["that whoever could make two ears of corn... would deserve better of mankind… than the whole race of politicians put together.", 5],
				["'You're a bitter man'... 'That's because I've lived'", 6],
				["Let us cultivate our garden.", 6],
				["If this is the best of possible worlds, what then are the others?", 6],
				["Our labour preserves us from three great evils -- weariness, vice, and want.", 6],
				["Come! your presence will either give me life or kill me with pleasure.", 6],
				["Nothing is so painful to the human mind as a great and sudden change.", 7],
				["Beware; for I am fearless, and therefore powerful.", 7],
				["Life, although it may only be an accumulation of anguish, is dear to me, and I will defend it.", 7],
				["If I cannot inspire love, I will cause fear!", 7],
				["There is something at work in my soul, which I do not understand.", 7],
				["I know not all that may be coming, but be it what it will, I'll go to it laughing.", 8],
				["It is not down on any map; true places never are.", 8],
				["Better to sleep with a sober cannibal than a drunk Christian.", 8],
				["As for me, I am tormented with an everlasting itch for things remote. I love to sail forbidden seas, and land on barbarous coasts.", 8],
				["I try all things, I achieve what I can.", 8],
				["Of all creatures that breathe and move upon the earth, nothing is bred that is weaker than man.", 9],
				["There is a time for many words, and there is also a time for sleep.", 9],
				["For a friend with an understanding heart is worth no less than a brother", 9],
				["A man who has been through bitter experiences and travelled far enjoys even his sufferings after a time", 9],
				["Sleep, delicious and profound, the very counterfeit of death", 9],
				["It's a release to know that in spite of everything a premeditated act of courage is still possible.", 10],
				["Good god, people don't do such things!", 10],
				["I am burning-I am burning your child.", 10],
				["I can see him already-with vine-leaves in his hair-flushed and fearless.", 10],
				["It's a liberation to know that an act of spontaneous courage is yet possible in this world.", 10],
				["You can't get away from yourself by moving from one place to another.", 11],
				["I can't stand it to think my life is going so fast and I'm not really living it.", 11],
				["It is awfully easy to be hard-boiled about everything in the daytime, but at night it is another thing.", 11],
				["'How did you go bankrupt?' Two ways. Gradually, then suddenly.", 11],
				["I am always in love.", 11],
				["I may not have been sure about what really did interest me, but I was absolutely sure about what didn't.", 12],
				["I opened myself to the gentle indifference of the world.", 12],
				["I had only a little time left and I didn't want to waste it on God.", 12],
				["Since we're all going to die, it's obvious that when and how don't matter.", 12],
				["If something is going to happen to me, I want to be there.", 12],
				["Perhaps one did not want to be loved so much as to be understood.", 13],
				["Who controls the past controls the future. Who controls the present controls the past.", 13],
				["The best books... are those that tell you what you know already.", 13],
				["If you want to keep a secret, you must also hide it from yourself.", 13],
				["We shall meet in the place where there is no darkness.", 13],
				["I've got death inside me. It's just a question of whether or not I can outlive it.", 14],
				["The greater the scientific advance, the more primitive the fear.", 14],
				["All plots tend to move deathward. This is the nature of plots.", 14],
				["It is possible to be homesick for a place even when you are there.", 14],
				["Some people are larger than life. Hitler is larger than death.", 14],
				["If you don't like my story,write your own", 15],
				["When the moon is shining the cripple becomes hungry for a walk", 15],
				["The world has no end, and what is good among one people is an abomination with others.", 15],
				["A child cannot pay for its mother's milk.", 15],
				["When mother-cow is chewing grass its young ones watch its mouth", 15],
				["A thing may happen and be a total lie; another thing may not happen and be truer than the truth.", 16],
				["But the thing about remembering is that you don't forget.", 16],
				["They carried all they could bear, and then some, including a silent awe for the terrible power of the things they carried.", 16],
				["I want you to feel what I felt. I want you to know why story-truth is truer sometimes than happening-truth.", 16],
				["I survived, but it's not a happy ending.", 16],
				["All I know is this: nobody's very big in the first place, and it looks to me like everybody spends their whole life tearing everybody else down.", 17],
				["But it's the truth even if it didn't happen.", 17],
				["He Who Marches Out Of Step Hears Another Drum", 17],
				["They can't tell so much about you if you got your eyes closed.", 17],
				["Good writin' ain't necessarily good readin'.", 17]
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
				actualAnswer = this.blocks[this.rightAnswer]; //this.rightTitle
				flag_gameOver = true;
			}
			oList.splice(oList.indexOf(this), 1);
		}
	};
	this.draw = function() {
		ctx.fillStyle = "red";
		ctx.fillRect(0, this.yPos, SIDE_LEN / 3, this.thickness);
		ctx.fillStyle = "blue";
		ctx.fillRect(SIDE_LEN / 3 * 2, this.yPos, SIDE_LEN / 3, this.thickness);
		ctx.fillStyle = "green";//ctx.fillStyle = "#565656";
		ctx.fillRect(SIDE_LEN / 3, this.yPos, SIDE_LEN / 3, this.thickness);

		ctx.fillStyle = "#dedede";
		ctx.fillRect(0, this.yPos - this.thickness, SIDE_LEN, this.thickness);

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "white";
		ctx.font = "bold 15px 'Open Sans', sans-serif";
		for (var i = 0; i < this.blocks.length; i++) {
			ctx.fillText(this.blocks[i], SIDE_LEN * (1/6 + 1/3 * i), this.yPos + this.thickness / 2, SIDE_LEN / 3);
		}

		ctx.fillStyle = "black";
		ctx.fillText("\"" + this.quote[0] + "\"", SIDE_LEN / 2, this.yPos - this.thickness / 2, SIDE_LEN - 20);

		ctx.drawImage(img_hartnett, SIDE_LEN / 2 - ((667 / 10) / 2), this.yPos - this.thickness - 1400 / 10, 667 / 10, 1400 / 10);
		//ctx.drawImage(img_hartnett, SIDE_LEN / 8, this.yPos, 667 / 10, 1400 / 10);
		//ctx.drawImage(img_hartnett, SIDE_LEN - SIDE_LEN / 8, this.yPos, 667 / 10, 1400 / 10);
	};
	oList.push(this);
}

canvas.addEventListener("mousemove", function(evt) {
	mousePos = [evt.offsetX / canvas.offsetWidth * SIDE_LEN, evt.offsetY / canvas.offsetWidth * SIDE_LEN];
});

canvas.addEventListener("touchmove", function(evt) {
	mousePos = [(evt.touches[0].pageX - evt.touches[0].target.offsetLeft) / canvas.offsetWidth * SIDE_LEN, (evt.touches[0].pageY - evt.touches[0].target.offsetTop) / canvas.offsetWidth * SIDE_LEN];
});

canvas.addEventListener("click", function(evt) {
	if (flag_gameOver) restart();
});

rInterval1 = 0;
rInterval2 = 0;
rAnimFrame = 0;

var flag_gameOver = false;

function gameOver() {
	window.clearInterval(rInterval1);
	window.clearInterval(rInterval2);
	window.cancelAnimationFrame(rAnimFrame);
	ctx.fillStyle = "black";
	ctx.fillRect(SIDE_LEN / 6, SIDE_LEN / 6, SIDE_LEN / 6 * 4, SIDE_LEN / 6 * 4);
	ctx.font = "55px 'Open Sans', sans-serif";
	ctx.fillStyle = "white";
	ctx.fillText("Correct Answer:", SIDE_LEN / 2, SIDE_LEN / 2 - SIDE_LEN / 24 * 3, SIDE_LEN / 6 * 4);
	ctx.font = "45px 'Open Sans', sans-serif";
	ctx.fillText(actualAnswer, SIDE_LEN / 2, SIDE_LEN / 2, SIDE_LEN / 6 * 4);
	ctx.font = "35px 'Open Sans', sans-serif";
	ctx.fillText("Score: " + uiObj.score, SIDE_LEN / 2, SIDE_LEN / 2 + SIDE_LEN / 24 * 3, SIDE_LEN);
}

function restart() {
	oList = [scoreObj];
	flag_gameOver = false;
	uiObj.score = 0;
	rInterval1 = window.setInterval(runTick, 1/60 * 1000);
	rInterval2 = window.setInterval(generateAdversary, (SIDE_LEN / (FALL_SPEED) / 3) * (1/60 * 1000));
	generateAdversary();
	rAnimFrame = window.requestAnimationFrame(runDraw);
}

ctx.fillStyle = "white";
ctx.fillRect(0, 0, SIDE_LEN, SIDE_LEN);

function runTick() {
	playerObj.tick();
	
	for (var tObj of oList) {
		tObj.tick();
	}

	if (flag_gameOver) {
		gameOver();
		return;
	}
}

function runDraw() {
	//ctx.fillStyle = "white";
	//ctx.fillRect(0, 0, SIDE_LEN, SIDE_LEN);
	ctx.clearRect(0, 0, SIDE_LEN, SIDE_LEN);
	ctx.drawImage(img_background, 0, 0, 800, 800);

	for (var tObj of oList) {
		tObj.draw();
	}
	playerObj.draw();
	uiObj.draw();

	if (!flag_gameOver) rAnimFrame = window.requestAnimationFrame(runDraw);
}

function generateAdversary() {
	new ChallengeRow();
}

restart();