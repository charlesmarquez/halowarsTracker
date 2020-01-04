const config = require('./../../../config')
import { MongoClient } from "mongodb";

interface PlayerLookup {
    _id: string;
    playlist: string;
    lastOnline: string
}

export class MongoManager {
    
    private url: string;
    private options: object;
    private dbname: string;
    private collection: string;

    constructor() {
        this.url = config.url
        this.options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 30
        }
        this.dbname = config.dbname;
        this.collection = config.collection;
    }
    
    public getValues = async () => {
        
        const conn = await this.getConnection()
    
        const db = conn.db(this.dbname)
        const coll = await db.collection(this.collection)
        const res = await coll.find().toArray();
    
        conn.close()
    
        console.log('getValues', res);
        return res
    }
    
    public updateValue = async (item: any) => {
        this.getConnection().then(async (conn: any) => {
            const coll = conn.db(this.dbname).collection(this.collection)
    
            // Collection dropped everytime, may be a flaw

            coll.drop() 

            for (const row of item) {
                coll.insertOne(row)
            }

            conn.close()
            
            console.log(`Database Updated (${item.length})`)
            return true
        }).catch((err: any) => {
            console.error(`{updateValues}`, err);
            return false
        });
    }
    
    private getConnection = () => {
        var conn = MongoClient.connect(this.url, this.options)
        return conn
    }
}

