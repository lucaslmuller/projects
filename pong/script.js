const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const game = {
    paused: false,
    started: true,
};

const players = {
    left: null,
    right: null,
};

let ball = null;

function Ball(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = -5;
    this.vy = 4;

    this.reset = function() {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vx = -5;
        this.vy = clamp(parseInt(Math.random() * 10), 3, 6);
    }

    this.update = function() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.r >= innerHeight || (this.y - this.r) <= 0) {
            this.vy = (this.vy + .5) * -1;
        }

        if (this.vx <= 0 && this.checkCollision(players.left, 'left') || (this.vx >= 0 && this.checkCollision(players.right, 'right'))) {
            this.vx = (this.vx + .5) * -1;
        }

        if ((this.vx <= 0 && this.x < 5) || (this.vx <= 0 && this.x < 5)) {
            players.right.points++;
            this.reset();
        } else if ((this.vx >= 0 && (this.x + this.r) > (players.right.x + players.right.w + 5))) {
            players.left.points++;
            this.reset();
        }
    }

    this.checkCollision = function(player, side) {
        if (side === 'left') {
            return (
                ((this.x - this.r) < (player.x + player.w)) &&
                ((this.y - this.r) < (player.y + player.h)) && (this.y + this.r > player.y)
            );
        }

        return (
            (this.x + this.r > player.x) &&
            (this.y + this.r > player.y) && (this.y + this.r < player.y + player.h)
        );
    }

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function Player(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.points = 0;

    this.update = function() {
        // this.draw();
    }

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
        ctx.closePath();


        ctx.font = '35px Arial';
        ctx.fillText(this.points, (innerWidth / 2) + (this.x < innerWidth / 2 ? -40 : 40), 40);
        ctx.fill();

    }

    this.setY = function(refY) {
        this.y = clamp(refY - (this.h/2), 0, innerHeight - this.h);
    }
}

function setup() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    ctx.fillStyle = '#333';
    ctx.rect(0, 0, innerWidth, innerHeight);
    ctx.fill();

    ball = new Ball(innerWidth / 2, innerHeight / 2, 15);
    players.left = new Player(10, 10, 20, innerHeight / 3);
    players.right = new Player(innerWidth - 20 - 10, 10, 20, innerHeight / 3);


    canvas.addEventListener('mousemove', (e) => {
        if (game.started && !game.paused) {
            players.left.setY(e.clientY);
        }
    });

    draw();
}

function draw() {
    ctx.fillStyle = '#333';
    ctx.rect(0, 0, innerWidth, innerHeight);
    ctx.fill();

    if (game.started && !game.paused) {
        ball.update();
        players.left.update();
        players.right.update();
    }

    ball.draw();
    players.left.draw();
    players.right.draw();

    players.right.setY(ball.y);

    requestAnimationFrame(draw);
}

setup();


// -------------------------------

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}