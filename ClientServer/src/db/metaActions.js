
import { NoSuchCollectionError } from "../errors/errors.js";

export async function getMeta(mongoClient,collectionName,collectionCode) {
    const metaCollection = mongoClient.db("DB1").collection("Meta");
    //query for document in gameServers array with collection name PlayersN or GamesN
    let query = {};
    let projection = { _id: 0 };
    let metaArrayName;
    if (collectionName.charAt(0) == "P") {
        metaArrayName = "playersCollections";
    } else if (collectionName.charAt(0) == "G") {
        metaArrayName = "gamesCollections";
    } else if (collectionName.charAt(0) == "S") {
        metaArrayName = "gameServers";
    }
    if (collectionCode == undefined) {
        query[ metaArrayName + '.' + "name"] = collectionName;
        projection[metaArrayName] = { $elemMatch: { "name": collectionName }};
    } else {
        query[ metaArrayName + '.' + "collectionCode"] = collectionCode;
        projection[metaArrayName] = { $elemMatch: { "collectionCode": collectionCode }};
    }
    const document = await metaCollection.findOne(query, { projection: projection });
    if (!document) throw new NoSuchCollectionError(collectionName + '/' + collectionCode);
    const data = document[metaArrayName][0];
    return data;
}





export async function increment(mongoClient,collectionName,i=1) {
    const metaCollection = mongoClient.db("DB1").collection("Meta");
    let metaArrayName;
    if (collectionName.charAt(0) == 'P') metaArrayName = "playersCollections";
    else if (collectionName.charAt(0) == 'G') metaArrayName = "gamesCollections";
    else throw new NoSuchCollectionError(collectionName);
    let query = {};
    query[metaArrayName + '.' + "name"] = collectionName;
    let update = { $inc: {}};
    update["$inc"][metaArrayName + '.$[i].' + "current"] = i;
    await metaCollection.updateOne(
        query,
        update,
        {
            arrayFilters: [
                { "i.name": collectionName }
            ]
        }
    );
}

export async function decrement(mongoClient,collectionName,i=-1) {
    await increment(mongoClient,collectionName,i);
}
