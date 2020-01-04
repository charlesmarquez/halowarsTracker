import { MongoManager } from './../managers/MongoManager';
import { QueryManager } from '../managers/QueryManager';

interface Lookup {
    _id: string,
    Playlist: string,
    LastOnline: number,
    LastOnlineVal: number
}

export class LeaderBoard {
    public QueryManager: QueryManager;
    public MongoManager: MongoManager;
    public PlayerList: Array<string>;
    public Playlists: Array<string>;
    public PlayerActivity: Array<object> = [];

    constructor() {
        this.QueryManager = new QueryManager();
        this.MongoManager = new MongoManager();

        this.searchLeaderboard();
    }

    public getPlayers = () => {
        return this.PlayerList
    }

    private searchLeaderboard = () => {
            console.time('1')
            const LEADERBOARDQUERY = `query {
                Leaderboard (playlist: "all", count: 250)
            }`
            
            this.QueryManager.query(LEADERBOARDQUERY).then(res => {
                this.PlayerList = res.Leaderboard;
            }).then(res => {
                this.PlayerList = [...new Set(this.PlayerList)] // unique player list        
                
                const proms: Array<Promise<any>> = []
                for (const player of this.PlayerList) {
                    const data = this.searchPlayer(player)
                    proms.push(data)
                }
                
                Promise.all(proms).then(res => {
                    if (res.length > 0) {

                        // RES HAS null VALUES ?

                        const x = res.filter(val => val != null)
                        x.sort((b, a) => {return a.LastOnlineVal - b.LastOnlineVal})
                        this.MongoManager.updateValue(x);

                        setTimeout(() => {
                            this.searchLeaderboard()
                        }, 10000);
                        console.timeEnd('1')
                    }
                }).catch(err => {
                    console.log(err)
                    setTimeout(() => {
                        this.searchLeaderboard()
                    }, 10000);
                })
            })
    }

    private searchPlayer = async (player: string) => {
        const query = `
        query {
            Player (player: "${player}" count: "1") {
              MatchHistory{
                Playlist
                LastOnline
                LastOnlineVal
                }
              }
            }
        `

        const x = this.QueryManager.query(query).then(res => {
            const data = {
                _id: player,
                Playlist: res.Player.MatchHistory[0].Playlist,
                LastOnline: res.Player.MatchHistory[0].LastOnline,
                LastOnlineVal: res.Player.MatchHistory[0].LastOnlineVal
            }
            return data
        }).catch(err => {
            // console.log(player)
            return null
        })
        return Promise.resolve(x)
    }
}
