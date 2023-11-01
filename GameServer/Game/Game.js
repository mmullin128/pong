import { Ball } from "./Ball.js";
import { Player } from "./Player.js"
import { Vector2 } from "../Vector/Vector.js";
import { EventFrame, Frame, FrameBuffer } from "./FrameBuffer.js";
import { Boundary } from "./Boundary.js";
export class Game {
    static games = {};
    static n = 0;
    constructor(gameID,gameSettings,players=[]) {
        Game.n += 1;
        this.id = gameID;
        this.gameSettings = gameSettings;
        this.haltedTime = 0;
        this.gameDelay =1500;
        this.startTime = Date.now() - this.gameDelay;
        this.objects = {};
        //this.objects["ball1"] = new Ball(gameSettings.ballSize,{x: 0,y: 0},new Vector2(-3,0),0,0,"ball1");
        this.objects["right-wall"] = new Boundary('r',{x: 50, y: -50}, {x: 50, y: 50});
        this.objects["top-wall"] = new Boundary('t',{x: 50, y: 50}, {x: -50, y: 50});
        this.objects["left-wall"] = new Boundary('l',{x: -50, y: 50}, {x: -50, y: -50});
        this.objects["bottom-wall"] = new Boundary('b',{x: -50, y: -50}, {x: 50, y: -50});
        for (let player of players) {
            this.objects[player.id]  = Player.create(player.id,{x: player.playerData.length, y: player.playerData.width},new Vector2(15,5));
        }
        this.frameBuffer = new FrameBuffer(0,this.objects);
        Game.games[gameID] = this; 
    }
    update(t) {
        //(Object.values(this.objects).forEach(obj => { console.log(obj.id);}))
        const gameTime = ((t-this.gameDelay-this.haltedTime-this.startTime))/1000;
        console.log("T", gameTime);
        //console.log(this.frameBuffer.length);
        this.frameBuffer.integrate(gameTime);
        console.log(this.frameBuffer.workingFrame.objects["p1"].rotation);
        this.lastUpdateTime = Date.now()-this.gameDelay-this.haltedTime;
    }
    addEventFrame(time,id,event) {
        const addTime = (time-this.gameDelay-this.haltedTime-this.startTime)/1000;
        console.log('adding frame', addTime);
        this.frameBuffer.add(new EventFrame(addTime,id,this.objects[id].vel,-.1));
    }
}


export async function test() {
    const player1 = {
        id: "p1",
        playerData: { length: 1, width: 1}
    };
    const game = new Game("1",{ballSize: 40},[player1]);
    //console.log(game.objects);
    const time = Date.now();
    setInterval(() => {
        game.update(Date.now());
    }, 1000);
    setTimeout(() => {
        game.addEventFrame(Date.now(),"p1");
    },5000)
}

test();