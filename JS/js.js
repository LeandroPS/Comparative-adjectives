$(function(){
	activities = [
		{
			phrase1: "You're ",
			phrase2: " than me!",
			word: "taller",
			adjective: "tall",
			time: 25
		},
		{
			phrase1: "That's really ",
			phrase2: " than the other one!",
			word: "easier",
			adjective: "easy",
			time: 30
		},
		{
			phrase1: "you're ",
			phrase2: " than my other friends!",
			word: "funnier",
			adjective: "Funny",
			time: 30
		},
		{
			phrase1: "You are ",
			phrase2: " now than on monday!",
			word: "happier",
			adjective: "Happy",
			time: 30
		},
		{
			phrase1: "Your room is",
			phrase2: " than mine!",
			word: "cleaner",
			adjective: "Clean",
			time: 30
		}
	];

	function buildScreen(activity){
		screen = jQuery('<div class="screen activity"></div>');
		screen.append(jQuery('<canvas class="timer" id="timer" width="100" height="130"></canvas>'));
		center = jQuery('<div class="center"></div>');
		center.append('<h4 class="help">Fill the blanks with the comparative form of the adjective <span class="adjective">'+activity.adjective+'</span></h3>');
		center.append('<h3 class="phrase">'+activity.phrase1+'<div class="blanks"></div>'+activity.phrase2+'</h3>');
		screen.append(center);
		keyboard = jQuery('<div class="keyboard"></div>');
		carousel = jQuery('<div class="carousel"></div>');
		scroll = jQuery('<div class="scroll"></div>');
		
		letters = activity.word.toUpperCase();
		last_letter = "";
		for(i = 0; i<60; i++){
			new_letter = letters.charAt(Math.floor(Math.random()*(letters.length)));
			while(new_letter==last_letter){
				new_letter = letters.charAt(Math.floor(Math.random()*(letters.length)));
			}
			last_letter = new_letter;
			letter = jQuery('<div class="letter"></div>').text(new_letter);
			scroll.append(letter);
		}
		
		carousel.on("click", "div.letter", function(){
			letter = jQuery("<div></div>").text($(this).text()).addClass("letter pos");
			$("div.blanks").append(letter);
			$(this).addClass("gone");

			checkIfPassed();
		});
		
		carousel.append(scroll);
		keyboard.append(carousel);
		del = jQuery('<div class="delete">Delete</div>');
		del.click(function(){
			$("div.blanks div.letter:last-child").remove();
		});
		keyboard.append(del);
		screen.append(keyboard);
		$("body").append(screen);
		
		canvas = document.getElementById('timer');
		context = canvas.getContext('2d');
		x = canvas.width / 2;
		y = canvas.width / 2;
		radius = 35;
		
		//////
		
		limit = activity.time;
		time = 0;
		points += limit;
		
		timer = setInterval(function(){
			time= time + 0.05;
			points -= 0.05;
			var startAngle = 1.5 * Math.PI;
			var endAngle = getEndAngle(limit, time) * Math.PI;

			var counterClockwise = false;

			context.beginPath();
			context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
			context.lineWidth = 15;

			context.strokeStyle = '#4CAF50';
			context.stroke();
			
			context.font = "16px Arial";
			context.textAlign = "center";
			
			//context.clearRect(0,90,100,10);
			context.fillStyle = "white";
			context.clearRect(0,100,100,30);
			
			context.fillStyle = "black";
			context.fillText(Math.ceil(limit - time)+" sec",50.5,120);

			if(time>limit){
				$("div.out-of-time").addClass("show");
				clearInterval(timer);
			}
		}, 50);
	}	
	counter = 0;
	activity = activities[counter];
	
	function getEndAngle(maxSec, sec){
		return (sec*2/maxSec) - 0.5;
	}

	var canvas, context, x, y, radius;

	time = 0;
	
	points = 0;
	
	function checkIfPassed(){
		answer = "";
		$("div.blanks div.letter").each(function(){
			answer = answer + $(this).text();
			
		});
		if(answer == activity.word.toUpperCase()){
			$("div.awesome").addClass("show");
			//points += time;
			clearInterval(timer);
		}
		
	}
	
	$("button.start").click(function(){
		buildScreen(activity);
		$("div.initial").addClass("disappear");
		$("div.activity").addClass("show");
		$("div.scroll").addClass("run");
	});

	$("button.btn-next").click(function(){
		if(activities[counter+1] != null){
			
			$("div.screen").remove();
			counter++;
			activity = activities[counter];
			buildScreen(activity);
			$("div.activity").addClass("show");
			$("div.scroll").addClass("run");
			$("div.awesome").removeClass("show");
		}else{
			$("span.points").text(Math.floor(points*10));
			points = 0;
			$("div.end").addClass("show");
		}
	});
	
	$('button.btn-restart').click(function(){
		$("div.screen").remove();
		counter = 0;
		activity = activities[counter];
		buildScreen(activity);
		$("div.activity").addClass("show");
		$("div.scroll").addClass("run");
		$("div.out-of-time, div.end, div.awesome").removeClass("show");
	});	
});