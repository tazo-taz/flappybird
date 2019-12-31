	canvas = document.querySelector('#can')
	can = canvas.getContext('2d')

	var bird = new Image()
	var bg = new Image()
	var fb = new Image()
	var pipeNorth = new Image()
	var pipeSouth = new Image()
	var fly = new Audio('fly.mp3');
	var score = new Audio('score.mp3')
	

	enable = true
	gameover = false
	bird.src = "bird.png"
	bg.src = "bg.png"
	fb.src = "fg.png"
	pipeNorth.src = "pipeNorth.png"
	pipeSouth.src = "pipeSouth.png"
	positionY = (canvas.height - bird.height) / 2
	gap = 80
	scores = 0
	maxScore = localStorage.getItem('maxscore') || 0

	pipes = [{ x: canvas.width, y: 0, enable: true, played: false }]


	function draw() {
		can.drawImage(bg, 0, 0)
		can.drawImage(bg, bg.width, 0)

		can.drawImage(bird, 20, positionY)

		for (var i = 0; i < pipes.length; i++) {
			can.drawImage(pipeNorth, pipes[i].x, pipes[i].y)
			can.drawImage(pipeSouth, pipes[i].x, pipes[i].y + pipeNorth.height + gap)

			pipes[i].x -= 3
			var rect1 = { x: pipes[i].x, y: pipes[i].y, width: pipeNorth.width, height: pipeNorth.height }
			var rect2 = { x: 20, y: positionY, width: bird.width, height: bird.height }
			var rect3 = { x: pipes[i].x, y: pipes[i].y + pipeNorth.height + gap, width: pipeSouth.width, height: pipeSouth.height }
			var rect4 = { x: 0, y: canvas.height - fb.height + 10, width: canvas.width, height: fb.height }
			if ((rect1.x < rect2.x + rect2.width &&
				rect1.x + rect1.width > rect2.x &&
				rect1.y < rect2.y + rect2.height &&
				rect1.y + rect1.height > rect2.y) || (rect2.x < rect3.x + rect3.width &&
					rect2.x + rect2.width > rect3.x &&
					rect2.y < rect3.y + rect3.height &&
					rect2.y + rect2.height > rect3.y) || (positionY + bird.height > canvas.height - fb.height) || (positionY < 0)) {
				gameover = true
				maxScore = maxScore < scores ? scores : maxScore
				localStorage.setItem('maxscore',maxScore.toString())
				function drawTextBG(ctx, txt, font, x, y) {
					ctx.save();
					ctx.font = font;
					ctx.textBaseline = 'top';
					ctx.fillStyle = 'black';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.fillStyle = 'white';
					ctx.fillText(txt, x, y);
					ctx.font = '30px sans-serif'
					ctx.fillStyle = 'white';
					ctx.fillText(`Max Score: ${maxScore}`, 170, y + 100);
					}
					drawTextBG(can,'Game Over','80px sans-serif',60,150)
				clearInterval(x)
					setTimeout(() => {location.reload()},3000)
				return

			}else{
				if(pipes[i].x <= 20 -pipeNorth.width && pipes[i]['played'] == false){
					pipes[i]['played'] = true
					score.play()
					scores++
				}
			}
			if (pipes[i].x < canvas.width - 280 && pipes[i]['enable'] && pipes[i].enable) {

				pipes.push({ x: canvas.width, y: -Math.floor(Math.random() * pipeNorth.height), enable: true, played: false })
				pipes[i]['enable'] = false;
			}

		}
		positionY += 1.5

		can.drawImage(fb, 0, canvas.height - fb.height + 10)
		can.drawImage(fb, fb.width, canvas.height - fb.height + 10)
		can.font = "30px Arial";
		can.fillText(`score: ${scores}`, 10, 50);
	}
	x = setInterval(draw,1000/60)
	document.addEventListener('keydown', a => {
		switch (a.keyCode) {
			case 38:
				positionY -= 30
				scoreVoice()
				break;
			case 40:
				positionY += 30
				scoreVoice()
				break;
		}
	}
	
	)
	function scoreVoice(){
		if(gameover)return
		fly.pause()
		fly.currentTime = 0;
		fly.play()
	}