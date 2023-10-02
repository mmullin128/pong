
import { NoSuchCollectionError } from "../errors/errors.js";

export async function getMeta(mongoClient,type,collectionCode) {
    const metaCollection = mongoClient.db("DB1").collection("Meta");
    //query for document in gameServers array with collection name PlayersN or GamesN
    let query = {};
    let projection = { _id: 0 };
    let metaArrayName;
    if (type.charAt(0) == "P") {
        metaArrayName = "playersCollections";
    } else if (type.charAt(0) == "G") {
        metaArrayName = "gamesCollections";
    }
    if (type.charAt(0) == "S") {
        metaArrayName = "gameServers";
        if (collectionCode) {
            query[ metaArrayName + '.' + "name"] = collectionCode;
            projection[metaArrayName] = { $elemMatch: { "name": collectionCode }};
        }
    } else {
            
        query[ metaArrayName + '.' + "collectionCode"] = collectionCode;
        projection[metaArrayName] = { $elemMatch: { "collectionCode": collectionCode }};

    }
    const document = await metaCollection.findOne(query, { projection: projection });
    //console.log(query, projection,document);
    if (!document) throw new NoSuchCollectionError(type + ' / ' + metaArrayName + ' / ' + collectionCode);
    if (collectionCode) {
        const data = document[metaArrayName][0];
        return data;
    } else {
        const data = document[metaArrayName];
        return data;
    }
}

export async function getCodes(mongoClient,type) {
    if (type.charAt(0) == 'P') type = "Players";
    if (type.charAt(0) == 'G') type = "Games";
    const metaCollection = mongoClient.db("DB1").collection("Meta");
    let metaArrayName;
    if (type == "Players")  metaArrayName = "playersCollections";
    if (type == "Games")  metaArrayName = "gamesCollections";
    let projection = {};
    projection["_id"] = 0;
    projection[metaArrayName + '.' + "collectionCode"] = 1;
    const meta = await metaCollection.findOne(
        {},
        /*
        {
            projection: projection
        }
        */
    );
    const codes = meta[metaArrayName].map((obj) => { return obj.collectionCode});
    return codes;
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
