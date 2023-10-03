import { getMeta } from "./metaActions.js";
import { update } from "./update.js";

export async function addPlayer(mongoClient,gameID,gameCollectionCode,playerID,playerCollectionCode) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const gameCollectionData = await getMeta(mongoClient,"Game",gameCollectionCode);
    const playerCollectionData = await getMeta(mongoClient,"Player",playerCollectionCode);
    const gameCollection = mongoClient.db("DB1").collection(gameCollectionData.name);
    const playerCollection = mongoClient.db("DB1").collection(playerCollectionData.name);

    const game = await gameCollection.findOne({id : gameID});

    let updateDoc = {};
    let playerStatus;
    if (game.players.length > game.max) {
        playerStatus = "spectator";
    } else {
        playerStatus = "player";
    }
    await gameCollection.updateOne(
        {
            id: gameID
        },
        {
            $push: {
                "players": {
                    id: playerID,
                    collectionCode: playerCollectionCode,
                    playerStatus: playerStatus
                }
            }
        }
    );
    const updatedGame = await gameCollection.findOne({ id: gameID});
    if (updatedGame.players.length > game.max) {
        playerStatus = "spectator";
    } else {
        playerStatus = "player"
    }
    await gameCollection.updateOne(
        {
            id: gameID
        },
        {
            $set: {
                "players.$[i].playerStatus": playerStatus,
                "players.$[i].team": "N"
            }
        },
        {
            arrayFilters: [
                { "i.id": playerID }
            ]
        }
    )
    await playerCollection.updateOne(
        {
            id: playerID
        },
        {
            $set: {
                "playerStatus": playerStatus,
                "status": "InGame",
                "gameID": gameID
            }
        }
    )    
    return playerStatus;
}