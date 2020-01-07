const { fetch } = require('../req');
const config = require('./../../../config');
const func = require('../modules/functions');
const mapdata = require('../data/maps.json')
const moment = require('moment');

const obj1 = require('../data/game_objects_1.json')
const obj2 = require('../data/game_objects_2.json')
const obj3 = require('../data/game_objects_3.json')
const obj4 = require('../data/game_objects_4.json')

let gameobj = [ ...obj1.ContentItems, ...obj2.ContentItems, ...obj3.ContentItems, ...obj4.ContentItems ]

module.exports.resolvers = {
    Query: {
        Player: async (_, args) => {
            if (!args.count) { args.count = "1"}
            return args;
        },
        MatchDetails: async (_, args) => {
            return args;
        },
        Leaderboard: async (_, args) => {
            if (!args.count) { args.count = "250"};
            players = []

            if (args.playlist == 'all') {
                for (const playlist of config.playlists) {
                    var x = await fetch(`https://www.haloapi.com/stats/hw2/player-leaderboards/csr/${config.currentSeason}/${playlist.id}?count=${args.count}`, keys.getKey());
                    for (const res of x.Results) {
                        players.push(res.Player.Gamertag)
                    }
                }

                players = [...new Set(players)]
                return players;
            } else {
                for (const playlist of config.playlists) {
                    if (playlist.name == args.playlist) {playlistId = playlist.id}
                }
                var x = await fetch(`https://www.haloapi.com/stats/hw2/player-leaderboards/csr/${config.currentSeason}/${playlistId}?count=${args.count}`, keys.getKey());
    
                for (const res of x.Results) {
                    players.push(res.Player.Gamertag)
                }
                return players;
            }
        },
        PlayerActivity: (_, args) => {
            let res = []
            const currentTime = moment();
            console.log(`PlayerActivity ${currentTime}`)

            res['LastUpdatedVal'] = currentTime;
            res['LastUpdated'] = currentTime.format("dddd, MMMM Do YYYY, h:mm:ss a");
            res['Players'] = func.getPlayerActivity();
            return res
        },
        SeasonMetadata: async (_, args) => {
            let x = await fetch(`https://www.haloapi.com/metadata/hw2/seasons`, keys.getKey());
            
            let res = x.ContentItems.map(a => a.View)


            for (const z of res) {
                z.DevIdentity = modSeasonId(z.Identity)
            }

            return res

        }
     },
    Summary: {
        MatchHistory: async (parent, args) => {
            var mHistory = await fetch(`https://www.haloapi.com/stats/hw2/players/${parent.player}/matches?count=${parent.count}`, keys.getKey());

            if (mHistory) {
                for (const match of mHistory.Results) {
                    _handleMatch(match)
                }
            } else {
                console.log('parent.player', parent.player)
            }
            return mHistory.Results
        },
        Rating: async (parent, args) => {
            var ratings = {};
            for (const playlist of config.playlists) {
                var playlistRating = await fetch(`https://www.haloapi.com/stats/hw2/playlist/${playlist.id}/rating?players=${parent.player}`, keys.getKey());
                ratings["x" + playlist.name] = playlistRating.Results[0].Result
            }
            return ratings
        }
    },
    MatchDetails: {
        MatchEvents: async (parent, args) => {
            matchid = parent ? parent.MatchId : args.MatchId;
            var res = await fetch(`https://www.haloapi.com/stats/hw2/matches/${matchid}/events`, keys.getKey());
            return res.GameEvents
        }
    },
    MatchEvents: {
        PlayerJoined: async (parent, args) => {
            var arr = Object.values(parent)
            var res = arr.filter(x => x.EventName === "PlayerJoinedMatch" && x.HumanPlayerId !== null)
            return res
        },
        BuildingQueued: async (parent, args) => {
            var arr = Object.values(parent)
            var res = arr.filter(x => x.EventName === "BuildingConstructionQueued")
            return res
        },
        BuildingConstructionCompleted: async (parent, args) => {
            var arr = Object.values(parent)
            var res = arr.filter(x => x.EventName === "BuildingConstructionCompleted")
            return res
        },
        BuildingRecycled: async (parent, args) => {
            var arr = Object.values(parent)
            var res = arr.filter(x => x.EventName === "BuildingRecycled")
            return res
        },
        BuildingUpgraded: async (parent, args) => {
            var arr = Object.values(parent)
            var res = arr.filter(x => x.EventName === "BuildingUpgraded")
            return res
        },
        Death: async (parent, args) => {
            var arr = Object.values(parent)
            var res = arr.filter(x => x.EventName === "Death")
            return res
        },
        UnitTrained: async (parent, args) => {
            var arr = Object.values(parent)
            var res1 = arr.filter(x => x.EventName === "UnitTrained")
            var res2 = arr.filter(x => x.EventName === "Death")
            var res = handleDeaths(res1, res2);

            return res
        },
        TechResearched: async (parent, args) => {
            var arr = Object.values(parent)
            var res = arr.filter(x => x.EventName === "TechResearched")
            return res
        },
        ResourceHeartbeat: async (parent, args) => {
            var arr = Object.values(parent)
            var playerArr = []
            var res = arr.filter(x => x.EventName === "ResourceHeartbeat")
            for (const player of Object.keys(res[0].PlayerResources)) {
                playerArr.push(player)
            }
            res.PlayerCount = playerArr
            return res;
        },
    },
    PlayerJoined: {
        Leader: (parent, args) => {
            res = func.getLeaderDatabyId(parent.LeaderId)
            return res
        }
    },
    BuildingQueued: {
        Metadata: (parent, args) => {
            res = func.getObjectbyObjectId(parent.BuildingId)
            return res.View
        }
    },
    Death: {
        Participants: (parent, args) => {
            //    console.log(typeof parent.Participants);
            //    TODO:  Figure out how to parse deaths
        }
    },
    ResourceHeartbeat: {
        PlayerResources: (parent, args) => {
            // console.log(parent)
            res = {};
            // console.log(parent)

            for (const player of parent.PlayerCount) {
                res["P" + player] = []
            }

            for (const event of parent) {
                for ([k, v] of Object.entries(event.PlayerResources)) {
                    v.TimeSinceStartMilliseconds = event.TimeSinceStartMilliseconds
                    res["P" + k].push(v)
                }
            }

            return res
        }
    }
}

_handleMatch = (res) => {
    if (typeof res === 'undefined') {
        console.log(res)
    }

    const obj = mapdata.ContentItems.find(o => o.View.HW2Map.ID === res.MapId)
    const mediaUrl = obj.View.HW2Map.Image.View.Media.MediaUrl;
    res["MapUrl"] = mediaUrl;

    const obj1 = mapdata.ContentItems.find(o => o.View.HW2Map.ID === res.MapId)
    const mapName = obj1.View.Title;
    res["MapName"] = mapName;
    
    const obj2 = config.playlists.find(o => o.id === res.PlaylistId)
    obj2 ? res["Playlist"] = obj2.name : res["Playlist"] = "Custom"

    const i = moment.duration(res.PlayerMatchDuration);
    const j = moment(res.MatchStartDate.ISO8601Date)
    const lastOnline = Number(i+j);
    
    res["LastOnlineVal"] = lastOnline;
    res["Time"] = moment.now();
    res["LastOnline"] = moment(lastOnline).fromNow();

    // console.log(res)

    return res
}

class Unit {
    constructor(event) {
        this.Dies = false
        this.PlayerIndex = event.PlayerIndex
        this.SquadId = event.SquadId
        this.SquadName
        this.Id = event.InstanceId
        this.SupplyCost = event.SupplyCost
        this.EnergyCost = event.EnergyCost
        this.PopulationCost = event.PopulationCost
        this.TimeTrained = event.TimeSinceStartMilliseconds
        this.ProvidedByScenario = event.ProvidedByScenario 
        this.TimeDeath = 100000000
        this.IsClone = event.IsClone

        this.getName();
    }

    getName() {
        const x = gameobj.find(x => x.View.HW2Object.ObjectTypeId === this.SquadId)
        if (x) {
            this.SquadName = x.View.Title
        }
    }

    unitDie(event) {
        this.Dies = true
        this.TimeDeath = event.TimeSinceStartMilliseconds 
    }
}

handleDeaths = (trained, death) => {
    let units = []
    for (const event of trained) {
        const unit = new Unit(event);
        x = death.find(z => z.VictimInstanceId === unit.Id);
        if (x) {
            unit.unitDie(x)
        }
        units.push(unit)
    }
    return units
}

modSeasonId = (seasonId) => {
    return seasonId.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5")
}