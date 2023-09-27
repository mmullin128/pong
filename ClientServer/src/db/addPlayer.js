
export async function addPlayer(mongoClient,collectionNum,playerData,playersCollections) {
    //adds player to appropriate collection recursively
    if (!playersCollections) {
        const metaCollection = mongoClient.db("DB1").collection("Meta");
        const meta = await metaCollection.findOne({});
        playersCollections = meta["playersCollections"];
    }
    //

}