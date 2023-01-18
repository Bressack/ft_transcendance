
class Speed {
    x : number;
    y : number;
    constructor() {
       this.x = 10;
       this.y = Math.random() * 5 
    }
}

class Ball {
    x : number;
    y : number;
    r: number;
    speed: Speed;
    constructor() {
        this.x  = 550;
        this.y  = 360;
        this.r = 5;
        this.speed = new Speed;
     }
}

class Computer {
    score: number;
    y : number;
    speedRatio: number;

    constructor () {
        this.score = 0;
        this.y = 310;
        this.speedRatio = 1
    }
};

class Player {
    score: number;
    y : number;

    constructor () {
        this.score = 0;
        this.y = 310;
    }
};

class Game {
    player: Player;
    computer: Computer;
    ball: Ball;

    constructor () {
        this.player = new Player;
        this.computer = new Computer;
        this.ball = new Ball;
    }
};

export class GameInfo {
    canvas: HTMLCanvasElement;
    height_ratio : number;
    width_ratio : number;
    player_height : number;
    player_width : number;
    max_speed : number;
    game : Game;
    anim : number;
    
    constructor() {
        this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
        this.height_ratio = 1
        this.width_ratio = 1
        this.player_height = 100;
        this.player_width = 5;
        this.max_speed = 20;
        this.game = new Game;
        this.anim = 0;
        }

    draw() {
        // console.log("draw");

        this.height_ratio = this.canvas.height / 720;
        this.width_ratio = this.canvas.width / 1100;
        var context = <CanvasRenderingContext2D> this.canvas.getContext('2d');
        // this.getinfoserv();
        // Draw field
        context.fillStyle = 'black';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw middle line
        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(this.canvas.width / 2, 0);
        context.lineTo(this.canvas.width / 2, this.canvas.height);
        context.stroke();

        // Draw players
        context.fillStyle = 'white';
        context.fillRect(0, this.game.player.y * this.height_ratio, this.player_width * this.width_ratio, this.player_height * this.height_ratio);
        context.fillRect(this.canvas.width - (this.player_width * this.width_ratio), this.game.computer.y * this.height_ratio , this.player_width * this.width_ratio, this.player_height * this.height_ratio);

        // Draw ball
        context.beginPath();
        context.fillStyle = 'white';
        context.arc(this.game.ball.x * this.width_ratio, this.game.ball.y * this.height_ratio, this.game.ball.r * this.height_ratio, 0, Math.PI * 2, false);
        context.fill();

        context.font = `${this.canvas.height * 0.07}px 'Press Start 2P'`;
        context.fillText(this.game.player.score.toString(), (this.canvas.width / 2) - (this.canvas.width * 0.05 + context.measureText(this.game.player.score.toString()).width), this.canvas.height * 0.1);
        context.fillText(this.game.computer.score.toString(), (this.canvas.width / 2)  + (this.canvas.width * 0.05), this.canvas.height * 0.1);
    };
    update_and_draw(data: any)
    {
		console.log('yo', data)
        /*
            update game value
        */
        this.draw();
    }
    //server part
    // changeDirection(playerPosition: any) {
    //     var impact = this.game.ball.y - playerPosition - this.player_height / 2;
    //     var ratio = 100 / (this.player_height / 2);

    //     // Get a value between 0 and 10
    //     this.game.ball.speed.y = Math.round(impact * ratio / 10);
    //     console.log(this.game.ball.speed.y)
    // };
    computerMove() {
        this.game.computer.y += this.game.ball.speed.y * this.game.computer.speedRatio * 0.9;
    };
    // collide(player: any) {
        
    //     if (this.game.ball.y < player.y || this.game.ball.y > player.y + this.player_height) {
    //         this.reset();
    //         if (player == this.game.player) {
    //             this.game.computer.score++;
    //         } else {
    //             this.game.player.score++;
    //         }
    //     } else {
    //         this.game.ball.speed.x *= -1;
    //         this.changeDirection(player.y);
    //         if (Math.abs(this.game.ball.speed.x) < this.max_speed) {
    //             this.game.ball.speed.x *= 1.2;
    //         }
    //     }
    // };
    // ballMove() {
    //     if (this.game.ball.y > 720 || this.game.ball.y < 0) {
    //         this.game.ball.speed.y *= -1;
    //     }

    //     if (this.game.ball.x > (1100 - this.player_width)) {
    //         this.collide(this.game.computer);
    //     } else if (this.game.ball.x < this.player_width) {
    //         this.collide(this.game.player);
    //     }

    //     this.game.ball.x += this.game.ball.speed.x;
    //     this.game.ball.y += this.game.ball.speed.y;
    // };
    // reset() {
    //     this.game.ball.x = 550;
    //     this.game.ball.y = 360;
    //     this.game.player.y = 310;
    //     this.game.computer.y = 310;
    //     this.game.ball.speed.x = 10;
    //     this.game.ball.speed.y = Math.random() * 3;
    // };
};