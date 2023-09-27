
export async function increment(mongoClient,type,collectionName,i=1) {
    const metaCollection = mongoClient.db("DB1").collection("Meta");
    if (type == "Players") {
        await metaCollection.updateOne(
            {
                "playersCollections.name": collectionName
            },
            {
                $inc: {
                    "playersCollections.$[i].current": i
                }
            },
            {
                arrayFilters: [
                    { "i.name": collectionName }
                ]
            }

        );
    } else if (type == "Games") {
        await metaCollection.updateOne(
            {
                "gamesCollections.name": collectionName
            },
            {
                $inc: {
                    "gamesCollections.$[i].current": i
                }
            },
            {
                arrayFilters: [
                    { "i.name": collectionName}
                ]
            }
        );
    }
}

export async function decrement(mongoClient,type,collectionName) {
    await increment(mongoClient,type,collectionName,-1);
}
