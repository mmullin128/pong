import { getMeta } from "./metaActions.js";
import { update } from "./update.js";

export async function addPlayer(mongoClient,gameID,gameCollectionCode,playerID,playerCollectionCode) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const gameCollectionData = await getMeta(mongoClient,"Game",gameCollectionCode);
    const playerCollectionData = await getMeta(mongoClient,"Game",playerCollectionCode);
    const gameCollection = mongoClient.db("DB1").collection(gameCollectionData.name);
    const playerCollection = mongoClient.db("DB1").collection(playerCollectionData.name);

    const game = await gameCollection.findOne({id : gameID});

    let updateDoc = {};
    let playerStatus;
    if (game.players.length > game.max) {
        gameStatus = "spectator";
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
        await gameCollection.updateOne(
            {
                id: gameID
            },
            {
                $set: {
                    "players.$[i].playerStatus": "spectator"
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
                    "playerStatus": "spectator"
                }
            }
        )
        return "spectator";
    } else {
        await playerCollection.updateOne(
            {
                id: playerID
            },
            {
                $set: {
                    "playerStatus": "player"
                }
            }
        )
        return "player";
    }
}