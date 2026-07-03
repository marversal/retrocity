import React, { useEffect } from 'react';

const NEON = '#39FF14';
const FONT = '"VT323", monospace';

// ── BREAKOUT — 640 × 480 ─────────────────────────────────────────────
const BREAKOUT_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Breakout Protocol</title>
<style>
  * { padding: 0; margin: 0; }
  body { background: #000900; display: flex; justify-content: center; align-items: center; height: 100vh; }
  canvas { background: #050e00; display: block; box-shadow: 0 0 24px #39FF1444; border: 1px solid #39FF1466; }
</style>
</head>
<body>
<canvas id="myCanvas" width="640" height="480"></canvas>
<script>
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2.8; var dy = -2.8;
var ballRadius = 10;
var paddleHeight = 12; var paddleWidth = 90;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false; var leftPressed = false;
var brickRowCount = 4; var brickColumnCount = 7;
var brickWidth = 74; var brickHeight = 22;
var brickPadding = 10; var brickOffsetTop = 40;
var brickOffsetLeft = Math.round((canvas.width - (brickColumnCount*(brickWidth+brickPadding)-brickPadding)) / 2);
var bricks = [];
for(var c=0;c<brickColumnCount;c++){bricks[c]=[];for(var r=0;r<brickRowCount;r++){bricks[c][r]={x:0,y:0,status:1};}}
var score = 0; var lives = 3;
document.addEventListener("keydown",function(e){
  if(e.key=="Right"||e.key=="ArrowRight"){rightPressed=true;}
  else if(e.key=="Left"||e.key=="ArrowLeft"){leftPressed=true;}
},false);
document.addEventListener("keyup",function(e){
  if(e.key=="Right"||e.key=="ArrowRight"){rightPressed=false;}
  else if(e.key=="Left"||e.key=="ArrowLeft"){leftPressed=false;}
},false);
function collisionDetection(){
  for(var c=0;c<brickColumnCount;c++){for(var r=0;r<brickRowCount;r++){
    var b=bricks[c][r];
    if(b.status==1){
      if(x>b.x&&x<b.x+brickWidth&&y>b.y&&y<b.y+brickHeight){
        dy=-dy; b.status=0; score++;
        if(score==brickRowCount*brickColumnCount){alert("YOU WIN // SYSTEM CLEAR");document.location.reload();}
      }
    }
  }}
}
function drawBall(){
  ctx.shadowBlur=10; ctx.shadowColor="#39FF14";
  ctx.beginPath();ctx.arc(x,y,ballRadius,0,Math.PI*2);
  ctx.fillStyle="#39FF14";ctx.fill();ctx.closePath();
  ctx.shadowBlur=0;
}
function drawPaddle(){
  ctx.shadowBlur=8; ctx.shadowColor="#39FF14";
  ctx.beginPath();ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
  ctx.fillStyle="#39FF14";ctx.fill();ctx.closePath();
  ctx.shadowBlur=0;
}
function drawBricks(){
  for(var c=0;c<brickColumnCount;c++){for(var r=0;r<brickRowCount;r++){
    if(bricks[c][r].status==1){
      var brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
      var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;
      bricks[c][r].x=brickX; bricks[c][r].y=brickY;
      ctx.shadowBlur=4; ctx.shadowColor="#39FF14";
      ctx.beginPath();ctx.rect(brickX,brickY,brickWidth,brickHeight);
      ctx.fillStyle="#39FF14";ctx.fill();ctx.closePath();
      ctx.shadowBlur=0;
      ctx.strokeStyle="#000900";ctx.lineWidth=1.5;
      ctx.strokeRect(brickX+1,brickY+1,brickWidth-2,brickHeight-2);
    }
  }}
}
function drawHUD(){
  ctx.font="bold 16px monospace";ctx.fillStyle="#39FF14";
  ctx.shadowBlur=6;ctx.shadowColor="#39FF14";
  ctx.fillText("SCORE: "+score,12,24);
  ctx.fillText("LIVES: "+lives,canvas.width-90,24);
  ctx.shadowBlur=0;
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBricks();drawBall();drawPaddle();drawHUD();collisionDetection();
  if(x+dx>canvas.width-ballRadius||x+dx<ballRadius){dx=-dx;}
  if(y+dy<ballRadius){dy=-dy;}
  else if(y+dy>canvas.height-ballRadius){
    if(x>paddleX&&x<paddleX+paddleWidth){dy=-dy;}
    else{
      lives--;
      if(!lives){alert("GAME OVER // SYSTEM FAILURE");document.location.reload();}
      else{x=canvas.width/2;y=canvas.height-30;dx=2.8;dy=-2.8;paddleX=(canvas.width-paddleWidth)/2;}
    }
  }
  if(rightPressed&&paddleX<canvas.width-paddleWidth){paddleX+=8;}
  else if(leftPressed&&paddleX>0){paddleX-=8;}
  x+=dx;y+=dy;
  requestAnimationFrame(draw);
}
draw();
</script>
</body>
</html>`;

// ── PONG — 640 × 480 ─────────────────────────────────────────────────
const PONG_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Pong Matrix</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background-color: #000900; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; font-family: 'Courier New', Courier, monospace; flex-direction: column; }
.score-board { width: 640px; display: flex; justify-content: space-between; font-size: 3.5rem; font-weight: bold; padding: 0 20px; margin-bottom: 8px; color: #39FF14; text-shadow: 0 0 12px #39FF14; }
canvas { background-color: #000900; border: 1px solid #39FF1455; box-shadow: 0 0 20px #39FF1422; }
</style>
</head>
<body>
<div class="score-board">
  <span id="player-score">0</span>
  <span id="ai-score">0</span>
</div>
<canvas id="pongCanvas"></canvas>
<script>
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 640; canvas.height = 420;
const paddleWidth = 12; const paddleHeight = 80;
let playerY = (canvas.height-paddleHeight)/2;
let aiY = (canvas.height-paddleHeight)/2;
let ballX = canvas.width/2; let ballY = canvas.height/2;
let ballSpeedX = 5; let ballSpeedY = 4;
const ballRadius = 8;
let playerScore = 0; let aiScore = 0;
function drawRect(x,y,w,h,color){
  ctx.shadowBlur=6;ctx.shadowColor=color;
  ctx.fillStyle=color;ctx.fillRect(x,y,w,h);
  ctx.shadowBlur=0;
}
function drawArc(x,y,r,color){
  ctx.shadowBlur=8;ctx.shadowColor=color;
  ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2,false);ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;
}
function resetBall(){ballX=canvas.width/2;ballY=canvas.height/2;ballSpeedX=-ballSpeedX;ballSpeedY=4;}
function moveThings(){
  ballX+=ballSpeedX;ballY+=ballSpeedY;
  if(ballY-ballRadius<0||ballY+ballRadius>canvas.height){ballSpeedY=-ballSpeedY;}
  aiY+=(ballY-(aiY+paddleHeight/2))*0.1;
  let pH=ballX-ballRadius<paddleWidth&&ballY>playerY&&ballY<playerY+paddleHeight;
  let aH=ballX+ballRadius>canvas.width-paddleWidth&&ballY>aiY&&ballY<aiY+paddleHeight;
  if(pH){
    let cp=(ballY-(playerY+paddleHeight/2))/(paddleHeight/2);
    let ar=(Math.PI/4)*cp; let dir=ballX<canvas.width/2?1:-1;
    ballSpeedX=dir*7*Math.cos(ar);ballSpeedY=7*Math.sin(ar);
  }
  if(aH){
    let cp=(ballY-(aiY+paddleHeight/2))/(paddleHeight/2);
    let ar=(Math.PI/4)*cp; let dir=ballX<canvas.width/2?1:-1;
    ballSpeedX=dir*7*Math.cos(ar);ballSpeedY=7*Math.sin(ar);
  }
  if(ballX-ballRadius<0){aiScore++;document.getElementById("ai-score").innerText=aiScore;resetBall();}
  else if(ballX+ballRadius>canvas.width){playerScore++;document.getElementById("player-score").innerText=playerScore;resetBall();}
}
canvas.addEventListener("mousemove",(evt)=>{
  let rect=canvas.getBoundingClientRect();
  playerY=evt.clientY-rect.top-paddleHeight/2;
});
function draw(){
  drawRect(0,0,canvas.width,canvas.height,'#000900');
  ctx.strokeStyle="#39FF1433";ctx.setLineDash([8,12]);ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(canvas.width/2,0);ctx.lineTo(canvas.width/2,canvas.height);ctx.stroke();
  drawRect(0,playerY,paddleWidth,paddleHeight,'#39FF14');
  drawRect(canvas.width-paddleWidth,aiY,paddleWidth,paddleHeight,'#39FF14');
  drawArc(ballX,ballY,ballRadius,'#39FF14');
}
function gameLoop(){moveThings();draw();}
setInterval(gameLoop,1000/60);
</script>
</body>
</html>`;

// ── SPACE SHOOTER — 640 × 480 (neon green CRT skin) ──────────────────
const SPACE_SHOOTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JAMMER // SPACE INTERCEPTOR</title>
    <style>
        body {
            margin: 0;
            background: #000900;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #39FF14;
            font-family: 'Courier New', Courier, monospace;
            overflow: hidden;
        }
        canvas {
            border: 1px solid #39FF1455;
            background-color: #000900;
            box-shadow: 0 0 24px #39FF1433;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="640" height="480"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        let score = 0;
        let gameOver = false;
        let player, bullets, enemies, stars;

        class Player {
            constructor() {
                this.width = 50;
                this.height = 40;
                this.x = canvas.width / 2 - this.width / 2;
                this.y = canvas.height - this.height - 20;
                this.speed = 6;
                this.dx = 0;
            }
            draw() {
                ctx.shadowBlur = 10; ctx.shadowColor = '#39FF14';
                ctx.fillStyle = '#39FF14';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x, this.y + this.height);
                ctx.lineTo(this.x + this.width, this.y + this.height);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#000900';
                ctx.fillRect(this.x + this.width/2 - 5, this.y + 14, 10, 10);
            }
            move() {
                this.x += this.dx;
                if (this.x < 0) this.x = 0;
                if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
            }
            shoot() {
                bullets.push(new Bullet(this.x + this.width / 2 - 2.5, this.y));
            }
        }

        class Bullet {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.width = 5; this.height = 15;
                this.speed = 10;
            }
            draw() {
                ctx.shadowBlur = 6; ctx.shadowColor = '#ffffff';
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.shadowBlur = 0;
            }
            update() { this.y -= this.speed; }
        }

        class Enemy {
            constructor() {
                this.width = 40; this.height = 30;
                this.x = Math.random() * (canvas.width - this.width);
                this.y = -this.height;
                this.speed = 1.8 + Math.random() * 1.2;
            }
            draw() {
                ctx.shadowBlur = 5; ctx.shadowColor = '#39FF14';
                ctx.fillStyle = '#39FF14';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = '#000900';
                ctx.fillRect(this.x + 10, this.y + 10, 5, 5);
                ctx.fillRect(this.x + 25, this.y + 10, 5, 5);
                ctx.shadowBlur = 0;
            }
            update() { this.y += this.speed; }
        }

        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speed = Math.random() * 2 + 0.5;
                this.alpha = Math.random() * 0.4 + 0.1;
            }
            draw() {
                ctx.fillStyle = 'rgba(57,255,20,' + this.alpha + ')';
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
            update() {
                this.y += this.speed;
                if (this.y > canvas.height) { this.y = 0; this.x = Math.random() * canvas.width; }
            }
        }

        function init() {
            player = new Player();
            bullets = []; enemies = []; stars = [];
            score = 0; gameOver = false;
            for (let i = 0; i < 100; i++) stars.push(new Star());
        }

        function handleInput() {
            window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
                if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;
                if (e.key === ' ' || e.key === 'Spacebar') { if (!gameOver) player.shoot(); }
                if (gameOver && (e.key === 'r' || e.key === 'R')) init();
            });
            window.addEventListener('keyup', (e) => {
                if (['ArrowLeft','a','ArrowRight','d'].includes(e.key)) player.dx = 0;
            });
        }

        function checkCollision(r1, r2) {
            return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x &&
                   r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
        }

        function update() {
            if (gameOver) return;
            stars.forEach(s => s.update());
            player.move();
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].update();
                if (bullets[i].y < 0) bullets.splice(i, 1);
            }
            if (Math.random() < 0.02) enemies.push(new Enemy());
            for (let i = enemies.length - 1; i >= 0; i--) {
                enemies[i].update();
                if (checkCollision(player, enemies[i])) { gameOver = true; }
                if (enemies[i].y > canvas.height) { enemies.splice(i, 1); continue; }
                for (let b = bullets.length - 1; b >= 0; b--) {
                    if (bullets[b] && enemies[i] && checkCollision(bullets[b], enemies[i])) {
                        enemies.splice(i, 1); bullets.splice(b, 1); score += 10; break;
                    }
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => s.draw());
            player.draw();
            bullets.forEach(b => b.draw());
            enemies.forEach(e => e.draw());

            ctx.shadowBlur = 6; ctx.shadowColor = '#39FF14';
            ctx.fillStyle = '#39FF14';
            ctx.font = '20px Courier New';
            ctx.fillText('SCORE: ' + score, 20, 30);
            ctx.shadowBlur = 0;

            if (gameOver) {
                ctx.fillStyle = 'rgba(0,9,0,0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.shadowBlur = 14; ctx.shadowColor = '#39FF14';
                ctx.fillStyle = '#39FF14';
                ctx.font = '40px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('SYSTEM BREACH', canvas.width / 2, canvas.height / 2 - 20);
                ctx.shadowBlur = 0;
                ctx.font = '20px Courier New';
                ctx.fillText('SCORE: ' + score, canvas.width / 2, canvas.height / 2 + 20);
                ctx.fillStyle = '#39FF1477';
                ctx.fillText('PRESS R TO REBOOT', canvas.width / 2, canvas.height / 2 + 60);
            }
        }

        function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
        init();
        handleInput();
        gameLoop();
    </script>
</body>
</html>`;

// ── Game config ───────────────────────────────────────────────────────
interface GameConfig { title: string; html: string; instructions: string; }

const GAME_CONFIG: Record<string, GameConfig> = {
  UPLINK: {
    title: 'UPLINK // BREAKOUT PROTOCOL',
    html: BREAKOUT_HTML,
    instructions: 'ARROW KEYS TO MOVE PADDLE // BREAK ALL BRICKS TO WIN',
  },
  BLOCKCHAIN: {
    title: 'BLOCKCHAIN // PONG MATRIX',
    html: PONG_HTML,
    instructions: 'MOUSE TO MOVE PADDLE // BEAT THE AI TO SCORE',
  },
  JAMMER: {
    title: 'JAMMER // SPACE INTERCEPTOR',
    html: SPACE_SHOOTER_HTML,
    instructions: 'ARROWS / WASD TO MOVE // SPACE TO FIRE // R TO REBOOT',
  },
};

// ── Modal ─────────────────────────────────────────────────────────────
interface GameModalProps { gameId: string; onClose: () => void; }

export function GameModal({ gameId, onClose }: GameModalProps) {
  const cfg = GAME_CONFIG[gameId];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!cfg) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,9,0,0.97)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Header */}
      <div style={{
        width: '90%', maxWidth: 880,
        background: '#000900',
        border: `1px solid ${NEON}`,
        borderBottom: 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px',
        color: NEON, fontSize: 16, letterSpacing: 3,
        boxShadow: `0 0 20px ${NEON}22`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#ff3300', fontSize: 10 }}>●</span>
          <span style={{ textShadow: `0 0 8px ${NEON}` }}>{cfg.title}</span>
        </div>
        <button onClick={onClose} style={{
          fontFamily: FONT, fontSize: 16, letterSpacing: 2,
          color: NEON, background: 'none', border: `1px solid ${NEON}55`,
          padding: '2px 14px', cursor: 'pointer',
        }}>
          [ ESC / EXIT ]
        </button>
      </div>

      {/* Game iframe */}
      <iframe
        srcDoc={cfg.html}
        style={{
          width: '90%', maxWidth: 880, height: '75vh',
          border: `1px solid ${NEON}`, background: '#000', display: 'block',
          boxShadow: `0 0 30px ${NEON}33`,
        }}
        title={cfg.title}
        allow="autoplay"
      />

      {/* Footer */}
      <div style={{
        width: '90%', maxWidth: 880,
        background: '#000900',
        border: `1px solid ${NEON}`, borderTop: 'none',
        padding: '6px 16px', color: NEON, opacity: 0.35,
        fontSize: 13, letterSpacing: 2,
      }}>
        {cfg.instructions}
      </div>
    </div>
  );
}
