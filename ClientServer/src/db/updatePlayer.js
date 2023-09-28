
export async function updatePlayer(mongoClient,collectionCode,id,playerData) {
    const collectionData = await getCollectionMeta(mongoClient,'Players',0,players[i].collectionCode);
    const playersCollection = mongoClient.db("DB1").collection(collectionData.collectionName);
    await playersCollection.updateOne(
        {
            "id": id
        },
        {
            $set: {
                playerData: playerData
            }
        }
    )
}