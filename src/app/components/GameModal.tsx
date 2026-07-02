import React, { useEffect } from 'react';

const NEON = '#39FF14';
const FONT = '"VT323", monospace';

// ── BREAKOUT ─────────────────────────────────────────────────────────
const BREAKOUT_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Breakout Protocol</title>
<style>
  * { padding: 0; margin: 0; }
  body { background: #000900; display: flex; justify-content: center; align-items: center; height: 100vh; }
  canvas { background: #111; display: block; box-shadow: 0 0 20px #39FF1444; border: 1px solid #39FF1466; }
</style>
</head>
<body>
<canvas id="myCanvas" width="480" height="320"></canvas>
<script>
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2; var dy = -2;
var ballRadius = 10;
var paddleHeight = 10; var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false; var leftPressed = false;
var brickRowCount = 3; var brickColumnCount = 5;
var brickWidth = 75; var brickHeight = 20;
var brickPadding = 10; var brickOffsetTop = 30; var brickOffsetLeft = 30;
var bricks = [];
for(var c=0;c<brickColumnCount;c++){bricks[c]=[];for(var r=0;r<brickRowCount;r++){bricks[c][r]={x:0,y:0,status:1};}}
var score = 0; var lives = 3;
document.addEventListener("keydown", function(e){
  if(e.key=="Right"||e.key=="ArrowRight"){rightPressed=true;}
  else if(e.key=="Left"||e.key=="ArrowLeft"){leftPressed=true;}
},false);
document.addEventListener("keyup", function(e){
  if(e.key=="Right"||e.key=="ArrowRight"){rightPressed=false;}
  else if(e.key=="Left"||e.key=="ArrowLeft"){leftPressed=false;}
},false);
function collisionDetection(){
  for(var c=0;c<brickColumnCount;c++){for(var r=0;r<brickRowCount;r++){
    var b=bricks[c][r];
    if(b.status==1){
      if(x>b.x&&x<b.x+brickWidth&&y>b.y&&y<b.y+brickHeight){
        dy=-dy; b.status=0; score++;
        if(score==brickRowCount*brickColumnCount){alert("YOU WIN // CONGRATULATIONS");document.location.reload();}
      }
    }
  }}
}
function drawBall(){ctx.beginPath();ctx.arc(x,y,ballRadius,0,Math.PI*2);ctx.fillStyle="#39FF14";ctx.fill();ctx.closePath();}
function drawPaddle(){ctx.beginPath();ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);ctx.fillStyle="#39FF14";ctx.fill();ctx.closePath();}
function drawBricks(){
  for(var c=0;c<brickColumnCount;c++){for(var r=0;r<brickRowCount;r++){
    if(bricks[c][r].status==1){
      var brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
      var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;
      bricks[c][r].x=brickX; bricks[c][r].y=brickY;
      ctx.beginPath();ctx.rect(brickX,brickY,brickWidth,brickHeight);
      ctx.fillStyle="#39FF14";ctx.fill();ctx.closePath();
    }
  }}
}
function drawScore(){ctx.font="16px monospace";ctx.fillStyle="#39FF14";ctx.fillText("SCORE: "+score,8,20);}
function drawLives(){ctx.font="16px monospace";ctx.fillStyle="#39FF14";ctx.fillText("LIVES: "+lives,canvas.width-80,20);}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBricks();drawBall();drawPaddle();drawScore();drawLives();collisionDetection();
  if(x+dx>canvas.width-ballRadius||x+dx<ballRadius){dx=-dx;}
  if(y+dy<ballRadius){dy=-dy;}
  else if(y+dy>canvas.height-ballRadius){
    if(x>paddleX&&x<paddleX+paddleWidth){dy=-dy;}
    else{
      lives--;
      if(!lives){alert("GAME OVER // SYSTEM FAILURE");document.location.reload();}
      else{x=canvas.width/2;y=canvas.height-30;dx=2;dy=-2;paddleX=(canvas.width-paddleWidth)/2;}
    }
  }
  if(rightPressed&&paddleX<canvas.width-paddleWidth){paddleX+=7;}
  else if(leftPressed&&paddleX>0){paddleX-=7;}
  x+=dx;y+=dy;
  requestAnimationFrame(draw);
}
draw();
</script>
</body>
</html>`;

// ── PONG ─────────────────────────────────────────────────────────────
const PONG_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Pong Matrix</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background-color: #000; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; font-family: 'Courier New', Courier, monospace; flex-direction: column; }
.score-board { width: 800px; display: flex; justify-content: space-between; font-size: 4rem; font-weight: bold; padding: 0 20px; margin-bottom: 8px; color: #39FF14; text-shadow: 0 0 12px #39FF14; }
canvas { background-color: #000; border: 1px solid #39FF1455; box-shadow: 0 0 20px #39FF1422; }
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
canvas.width = 800;
canvas.height = 500;
const paddleWidth = 15;
const paddleHeight = 100;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballRadius = 10;
let playerScore = 0;
let aiScore = 0;
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
}
function drawArc(x, y, r, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2, false); ctx.closePath(); ctx.fill();
}
function resetBall() {
    ballX = canvas.width / 2; ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; ballSpeedY = 5;
}
function moveThings() {
    ballX += ballSpeedX; ballY += ballSpeedY;
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) { ballSpeedY = -ballSpeedY; }
    aiY += (ballY - (aiY + paddleHeight / 2)) * 0.1;
    let playerHit = ballX - ballRadius < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight;
    let aiHit = ballX + ballRadius > canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight;
    if (playerHit) {
        let cp = ballY - (playerY + paddleHeight / 2);
        cp = cp / (paddleHeight / 2);
        let ar = (Math.PI / 4) * cp;
        let dir = ballX < canvas.width / 2 ? 1 : -1;
        ballSpeedX = dir * 7 * Math.cos(ar);
        ballSpeedY = 7 * Math.sin(ar);
    }
    if (aiHit) {
        let cp = ballY - (aiY + paddleHeight / 2);
        cp = cp / (paddleHeight / 2);
        let ar = (Math.PI / 4) * cp;
        let dir = ballX < canvas.width / 2 ? 1 : -1;
        ballSpeedX = dir * 7 * Math.cos(ar);
        ballSpeedY = 7 * Math.sin(ar);
    }
    if (ballX - ballRadius < 0) {
        aiScore++; document.getElementById("ai-score").innerText = aiScore; resetBall();
    } else if (ballX + ballRadius > canvas.width) {
        playerScore++; document.getElementById("player-score").innerText = playerScore; resetBall();
    }
}
canvas.addEventListener("mousemove", (evt) => {
    let rect = canvas.getBoundingClientRect();
    playerY = evt.clientY - rect.top - paddleHeight / 2;
});
function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    ctx.strokeStyle = "#39FF1444";
    ctx.setLineDash([10, 15]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    drawRect(0, playerY, paddleWidth, paddleHeight, '#39FF14');
    drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, '#39FF14');
    drawArc(ballX, ballY, ballRadius, '#39FF14');
}
function gameLoop() { moveThings(); draw(); }
setInterval(gameLoop, 1000 / 60);
</script>
</body>
</html>`;

// ── MISSILE COMMAND ───────────────────────────────────────────────────
const MISSILE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Missile Command</title>
  <style>
    body { margin: 0; background: #000; color: #39FF14; display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; font-family: monospace; }
    canvas { background: #000208; border: 1px solid #39FF1455; }
    .ui { margin-top: 8px; font-size: 16px; color: #39FF14; letter-spacing: 2px; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="800" height="560"></canvas>
  <div class="ui">SCORE: <span id="score">0</span> &nbsp;|&nbsp; AMMO: <span id="ammo">10</span></div>
  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const ammoEl = document.getElementById('ammo');
    let score = 0; let ammo = 10;
    let missiles = []; let explosions = [];
    let cities = [
      {x:150,y:520,alive:true},{x:300,y:520,alive:true},
      {x:450,y:520,alive:true},{x:600,y:520,alive:true}
    ];
    class Missile {
      constructor(x, y, targetX, targetY, speed) {
        this.x = x; this.y = y; this.tx = targetX; this.ty = targetY;
        this.dx = targetX - x; this.dy = targetY - y;
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.vx = (this.dx / this.distance) * speed;
        this.vy = (this.dy / this.distance) * speed;
        this.trail = [];
      }
      update() { this.trail.push({x:this.x,y:this.y}); if(this.trail.length>8) this.trail.shift(); this.x += this.vx; this.y += this.vy; }
      draw() {
        ctx.beginPath();
        for(let i=0;i<this.trail.length;i++){
          ctx.strokeStyle='rgba(255,50,50,'+(i/this.trail.length)*0.5+')';
          if(i===0) ctx.moveTo(this.trail[i].x,this.trail[i].y);
          else ctx.lineTo(this.trail[i].x,this.trail[i].y);
        }
        ctx.stroke();
        ctx.beginPath(); ctx.arc(this.x,this.y,3,0,Math.PI*2);
        ctx.fillStyle='#ff5555'; ctx.fill();
      }
    }
    class Explosion {
      constructor(x, y) { this.x=x; this.y=y; this.radius=5; this.maxRadius=35; this.alpha=1; }
      update() { this.radius+=2; this.alpha=1-(this.radius/this.maxRadius); }
      draw() {
        ctx.beginPath(); ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle='rgba(57,255,20,'+this.alpha*0.5+')';
        ctx.strokeStyle='rgba(57,255,20,'+this.alpha+')';
        ctx.lineWidth=2; ctx.fill(); ctx.stroke();
      }
    }
    setInterval(() => {
      const aliveCities = cities.filter(c=>c.alive);
      if(aliveCities.length>0 && Math.random()<0.5) {
        let startX = Math.random() * canvas.width;
        let target = aliveCities[Math.floor(Math.random()*aliveCities.length)];
        missiles.push(new Missile(startX,0,target.x,target.y,1.5));
      }
    },1000);
    canvas.addEventListener('click',(e)=>{
      if(ammo>0){
        let rect=canvas.getBoundingClientRect();
        let mx=e.clientX-rect.left; let my=e.clientY-rect.top;
        missiles.push(new Missile(canvas.width/2,canvas.height,mx,my,6));
        ammo--; ammoEl.innerText=ammo;
      }
    });
    function animate(){
      ctx.fillStyle='rgba(0,2,8,0.25)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      cities.forEach(city=>{
        if(city.alive){
          ctx.fillStyle='#39FF14';
          ctx.fillRect(city.x-20,city.y,40,20);
          ctx.fillRect(city.x-12,city.y-12,8,12);
          ctx.fillRect(city.x+4,city.y-12,8,12);
        }
      });
      for(let i=explosions.length-1;i>=0;i--){
        explosions[i].update(); explosions[i].draw();
        if(explosions[i].radius>explosions[i].maxRadius) explosions.splice(i,1);
      }
      for(let i=missiles.length-1;i>=0;i--){
        missiles[i].update(); missiles[i].draw();
        for(let j=0;j<explosions.length;j++){
          let dist=Math.sqrt((missiles[i].x-explosions[j].x)**2+(missiles[i].y-explosions[j].y)**2);
          if(dist<explosions[j].radius){
            missiles.splice(i,1); score+=100; scoreEl.innerText=score; break;
          }
        }
        if(missiles[i]&&missiles[i].y>=canvas.height-20){
          let m=missiles.splice(i,1)[0];
          explosions.push(new Explosion(m.x,m.y));
          cities.forEach(city=>{
            if(city.alive&&Math.abs(city.x-m.x)<30) city.alive=false;
          });
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  </script>
</body>
</html>`;

// ── Game config ───────────────────────────────────────────────────────
interface GameConfig { title: string; html: string; }
const GAME_CONFIG: Record<string, GameConfig> = {
  UPLINK:     { title: 'UPLINK // BREAKOUT PROTOCOL',    html: BREAKOUT_HTML },
  BLOCKCHAIN: { title: 'BLOCKCHAIN // PONG MATRIX',      html: PONG_HTML     },
  JAMMER:     { title: 'JAMMER // MISSILE COMMAND',      html: MISSILE_HTML  },
};

// ── Modal component ───────────────────────────────────────────────────
interface GameModalProps { gameId: string; onClose: () => void; }

export function GameModal({ gameId, onClose }: GameModalProps) {
  const cfg = GAME_CONFIG[gameId];

  // Close on Escape key
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
        background: 'rgba(0, 9, 0, 0.97)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Header bar */}
      <div style={{
        width: '90%', maxWidth: 900,
        background: '#000900',
        border: `1px solid ${NEON}`,
        borderBottom: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        color: NEON,
        fontSize: 16,
        letterSpacing: 3,
        boxShadow: `0 0 20px ${NEON}22`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#ff3300', fontSize: 10 }}>●</span>
          <span style={{ textShadow: `0 0 8px ${NEON}` }}>{cfg.title}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            fontFamily: FONT, fontSize: 16, letterSpacing: 2,
            color: NEON, background: 'none',
            border: `1px solid ${NEON}55`,
            padding: '2px 14px', cursor: 'pointer',
          }}
        >
          [ ESC / EXIT ]
        </button>
      </div>

      {/* Game iframe */}
      <iframe
        srcDoc={cfg.html}
        style={{
          width: '90%', maxWidth: 900,
          height: '75vh',
          border: `1px solid ${NEON}`,
          background: '#000',
          display: 'block',
          boxShadow: `0 0 30px ${NEON}33`,
        }}
        title={cfg.title}
        allow="autoplay"
      />

      {/* Footer */}
      <div style={{
        width: '90%', maxWidth: 900,
        background: '#000900',
        border: `1px solid ${NEON}`,
        borderTop: 'none',
        padding: '6px 16px',
        color: NEON,
        opacity: 0.35,
        fontSize: 12,
        letterSpacing: 2,
      }}>
        {gameId === 'UPLINK' && 'ARROW KEYS TO MOVE PADDLE // BREAKOUT PROTOCOL ACTIVE'}
        {gameId === 'BLOCKCHAIN' && 'MOUSE TO MOVE PADDLE // PONG MATRIX NODE ACTIVE'}
        {gameId === 'JAMMER' && 'CLICK TO FIRE INTERCEPTORS // MISSILE COMMAND ACTIVE'}
      </div>
    </div>
  );
}
