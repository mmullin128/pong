import { Ball } from "./Ball.js";
import { Player } from "./Player.js"
import { Vector2 } from "../Vector/Vector.js";
export class Game {
    static games = {};
    static n = 0;
    constructor(gameID,gameSettings,players=[]) {
        n += 1;
        this.id = n;
        this.gameSettings = gameSettings;
        this.objects = {};
        this.objects["ball1"] = new Ball(gameSettings.ballSize,{x: 0,y: 0},Vector2.random(1),0,0);
        for (let player of players) {
            this.objects[player.id]  = Player.create({x: player.playerData.length, y: player.playerData.width},Vector2.random(50));
        }
        games[gameID] = this; 
    }
}