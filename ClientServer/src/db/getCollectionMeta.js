import { NoSuchCollectionError } from "../errors/errors.js";

export async function getCollectionMeta(mongoClient,type,num,collectionCode) {
    const metaCollection = mongoClient.db("DB1").collection("Meta");
    //query for document in gameServers array with collection name PlayersN or GamesN
    /*
    const data = await metaCollection.findOne({
        "gameServers": {
            "name": type + num
        }
    });
    */
    const collectionName = type + num;
    let query = {};
    let projection = {};
    let metaArrayName;
    if (type == "Players")  {
        metaArrayName = "playersCollections";
        if (collectionCode) {
            query = { "playersCollections.collectionCode": collectionCode };
            projection = { "playersCollections": { $elemMatch: { "collectionCode": collectionCode }}, _id: 0};
        } else {
            query["playersCollections.name"] = collectionName;
            projection = { "playersCollections": { $elemMatch: { "name": collectionName }}, _id: 0};
        }
     } else if (type == "Games") {
        metaArrayName = "gamesCollections";
        if (collectionCode) {
            query = { "gamesCollections.collectionCode": collectionCode };
            projection = { "gamesCollections": { $elemMatch: { "collectionCode": collectionCode }}, _id: 0};
        } else {
            query["gamesCollections.name"] = collectionName;
            projection = { "gamesCollections": { $elemMatch: { "name": collectionName }}, _id: 0};
        }
    } else if (type == "S") {
        metaArrayName = "gameServers";
        if (collectionCode) {
            query = { "gameServers.collectionCode": collectionCode };
            projection = { "gameServers": { $elemMatch: { "collectionCode": collectionCode }}, _id: 0};
        } else {
            query["gameServers.name"] = collectionName;
            projection = { "gameServers": { $elemMatch: { "name": collectionName }}, _id: 0};
        }
    }
    const document = await metaCollection.findOne(query, { projection: projection });
    if (!document) throw new NoSuchCollectionError(collectionName);
    const data = document[metaArrayName][0];
    return data;
}