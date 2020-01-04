const mongo = require('mongodb').MongoClient
const assert = require('assert');
const config = require('../config');

const url = config.url
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const { dbname, collection } = config


const getConnection = () => {
    var conn = mongo.connect(url, options)
    return conn
}

const getValues = async () => {
    
    const conn = await getConnection()

    const db = conn.db(dbname)
    const coll = await db.collection(collection)
    const res = await coll.find().toArray();

    conn.close()

    return res
}

const updateValue = async (item) => {
    getConnection().then(async (conn) => {
        const coll = conn.db(dbname).collection(collection)

        const item = [{
            name: 'test1'
        }]

        for (const row of item) {
            uid = row._id
            coll.updateOne({
                _id: uid
            }, {
                $set: row
            }, {
                upsert: true
            })
        }

        console.log(`Database updated for ${item.length} rows.`);
        conn.close()
        return true
    }).catch((err) => {
        console.error(`{updateValues}`, err);
        return false
    });
}

updateValue()