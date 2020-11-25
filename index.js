const canvas = document.querySelector('canvas');
canvas.color = 'white'
const c = canvas.getContext('2d')

const scoreText = document.getElementById("scoreText")
const startButton = document.getElementById("startButton")
const startPanel = document.getElementById("startPanel")
const pointsPanelText = document.getElementById("pointsPanelText")

const cursor = document.getElementById("cursor")

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor(x,y,radius,color,velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    
    Draw() {
        c.beginPath()
        c.arc(this.x,this.y, this.radius,0,Math.PI*2,false)
        c.fillStyle =this.color
        c.fill()
    }
    
    Update() {
        this.Draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Bullet {
    constructor(x,y,radius,color, velocity) {
        this.x  =x
        this.y = y
        this.radius = radius
        this.color  = color
        this.velocity = velocity
    }
    
     Draw() {
        c.beginPath()
        c.arc(this.x,this.y, this.radius,0,Math.PI*2,false)
        c.fillStyle =this.color
        c.fill()
    }
    
    Update() {
        this.Draw()
        this.x = this.x + (this.velocity.x*bulletSpeed)
        this.y = this.y + (this.velocity.y * bulletSpeed)
    }
}

class GameUI {
     constructor(x,y,radius,color) {
        this.x  =x
        this.y = y
        this.radius = radius
        this.color  = color
    }
    
     Draw() {
        c.beginPath()
        c.arc(this.x,this.y, this.radius,0,Math.PI*2,false)
        c.fillStyle =this.color
        c.fill()
    }
}

class ClippingMask {
     constructor(x,y,radius) {
        this.x  =x
        this.y = y
        this.radius = radius
    }
    
     Draw() {
        c.beginPath()
        c.arc(this.x,this.y, this.radius,0,Math.PI*2,false)
        c.clip()
    }
}

function collision (p1x, p1y, r1, p2x, p2y, r2) {
   
    dist = Math.hypot(p1x - p2x, p1y - p2y)
    
    if(dist < (r1+r2))
    {
        return true   
    } 
    else 
    {
        return false
    }
}

circleSize = (canvas.height/2)
gameUI = new GameUI(canvas.width/2,canvas.height/2,circleSize, 'white')
gameUI.Draw()
spawnInterval = 250

enemySpawnTimer=0
totalBullets=0
score=0
gameOver=0
const moveSpeed = 10
const bulletSpeed = 5

const player = new Player(canvas.width/2,canvas.height/2,10,'black')
player.velocity = {x:0,y:0}
player.Draw()

bullets = []


let animationID
function Animate() {
    animationID = requestAnimationFrame(Animate)
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0,0,canvas.width,canvas.height)
    //c.clearRect(0,0,canvas.width,canvas.height)
    circleSize =(canvas.height/2) * (1 - (Math.floor(score/100) * 0.05))
    gameUI.radius = circleSize
    gameUI.Draw()
    
    player.Update()
    
    bullets.forEach(bullet =>    {
        if(collision(bullet.x,bullet.y,bullet.radius, canvas.width/2,canvas.height/2,circleSize + 1) == false) 
        {
            bullets.splice(bullets.indexOf(bullet),bullets.indexOf(bullet)+1)  
            score++
            if(score % 10 == 0) {
                scoreText.color = 'yellow'
            } else {
                scoreText.color = 'black'
            }
            scoreText.innerHTML = score
        }
        
        if(collision(bullet.x,bullet.y,bullet.radius, player.x,player.y,player.radius)) {
            //GAME OVER
           GameOver()
        }
        bullet.Update()
    })
}

function GameOver() {
    cancelAnimationFrame(animationID)
    gameOver=1
    window.startPanel.style.display = 'flex'
    
    window.pointsPanelText.innerHTML = score
    
    spawnInterval=250
    enemySpawnTimer=0
    score=0
    scoreText.innerHTML = score
    bullets = []
    
     document.body.style.cursor = 'default';
}

function spawnEnemy() {
    if(gameOver==1) {
        console.log("GAMEOVER")
        clearInterval(spawner)
        return
     }
    
    enemySpawnTimer++
    if(enemySpawnTimer > spawnInterval) {
        console.log("spawnedEnemy")
        enemySpawnTimer=0
        
        randomAngle = Math.random() * 360
        const pos = {
            x: (Math.sin(randomAngle) * (circleSize)) + canvas.width/2,
            y: (Math.cos(randomAngle) * (circleSize)) + canvas.height/2 
        }
        
        //GET ANGLE TO PLAYER
        const angle  = Math.atan2(
        player.y - pos.y,
        player.x - pos.x)
        
        //SET VELOCITY
        const velocity  = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        const bullet = new Bullet(pos.x,pos.y,5,'red', velocity)
        bullets.push(bullet)
        
        totalBullets++
        if(totalBullets % 10 == 0) {
            console.log("NEXT LEVEL")
            spawnInterval -= 25   
        }
        
        if(spawnInterval < 50) { 
            spawnInterval=50
        }
    }
}

function spawnEnemies() {
    spawner = setInterval(spawnEnemy)
}

onmousemove = function(e){
    if(collision(e.clientX,e.clientY,50,
                 canvas.width/2,canvas.height/2,circleSize-50)) 
    {
        console.log("collision")
        player.x = e.clientX
        player.y = e.clientY
    }
}

window.addEventListener('click', () => {
   
})

document.addEventListener('DOMContentLoaded', function () {
window.startButton.addEventListener('click', () => {
    Animate()  
    spawnEnemies()
    gameOver=0
    document.body.style.cursor = 'none';
    window.startPanel.style.display = 'none'
})})