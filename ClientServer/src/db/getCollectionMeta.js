
export async function getCollectionMeta(mongoClient,type,num) {
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
        query = { "playersCollections.name": collectionName };
        metaArrayName = "playersCollections";
        projection = { "playersCollections": { $elemMatch: { "name": collectionName }}, _id: 0};
    } else if (type == "Games") {
        query = { "gamesCollections.name": collectionName };
        //projection = { "gamesCollections": { $elemMatch: { "name": collectionName }}, _id: 0};
        metaArrayName = "gamesCollections";
        projection = { "gamesCollections.$": 1, _id: 0};
        //projection = { _id: -1 };
    } else if (type == "S") {
        query = { "gameServers.name": collectionName };
        metaArrayName = "gameServers";
        projection = { "gameServers": { $elemMatch: { "name": collectionName }}, _id: 0};
    }
    const document = await metaCollection.findOne(query, { projection: projection });
    const data = document[metaArrayName][0];
    return data;
}