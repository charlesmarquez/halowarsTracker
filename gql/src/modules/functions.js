var fs = require('fs');
var path = require('path');

var playlists = JSON.parse(fs.readFileSync(path.join(__dirname + `/../data/playlists.json`)))
var seasons = JSON.parse(fs.readFileSync(path.join(__dirname + `/../data/seasons.json`)))
var csr_designation = JSON.parse(fs.readFileSync(path.join(__dirname + `/../data/csr_designation.json`)))
var leaders = JSON.parse(fs.readFileSync(path.join(__dirname + `/../data/leaders.json`)))
var game_obj1 = JSON.parse(fs.readFileSync(path.join(__dirname + `/../data/game_objects_1.json`)))
var game_obj2 = JSON.parse(fs.readFileSync(path.join(__dirname + `/../data/game_objects_2.json`)))
var game_obj3 = JSON.parse(fs.readFileSync(path.join(__dirname + `/../data/game_objects_3.json`)))
var game_obj4 = JSON.parse(fs.readFileSync(path.join(__dirname + `/../data/game_objects_4.json`)))

const { MongoClient } = require('mongodb')
const config = require('../config')

const mergeJson = (game_objs) => {
    var res = []
    for (let i = 0; i < game_objs.length; i++) {
        const iter = game_objs[i].values();
        for (const value of iter) {
            res.push(value)
        }
    }
    return res
}

module.exports.getLeaderDatabyId = (id) => {
    var arr = Object.values(leaders.ContentItems)
    var res = arr.find(elem => elem.View.HW2Leader.Id == id)
    return res.View.HW2Leader
}

module.exports.getObjectbyObjectId = (id) => {
    var res = gameobjects.find(elem => elem.View.HW2Object.ObjectTypeId.toUpperCase() == id.toUpperCase())
    return res
}

module.exports.getPlayerActivity = async () => {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 30
        }
        
        const getConnection = () => {
            const conn = MongoClient.connect(config.url, options)
            return conn
        }

        const conn = await getConnection()
    
        const db = conn.db(config.dbname)
        const coll = await db.collection(config.collection)
        const res = await coll.find().toArray();
    
        conn.close()
    
        return res
}

var game_objs = [game_obj1.ContentItems, game_obj2.ContentItems, game_obj3.ContentItems, game_obj4.ContentItems]
var gameobjects = mergeJson(game_objs)

// var arr = Object.values(game_objs)
// id = 'unsc_bldg_supplypad_01'
// test = 'unsc_veh_rm_gausswarthog_01'

// console.log(arr.length);