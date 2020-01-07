var gql = require('graphql-tag');

module.exports.types = gql `
    type Query {
        Player (player: String!, count: String): Summary
        MatchDetails(MatchId: String!): MatchDetails!
        Leaderboard (playlist: String!, count: Int): [String!]
        PlayerActivity: PlayerActivity!
        SeasonMetadata: [SeasonMetadata]
    }

   type Summary {
       MatchHistory: [MatchDetails!]
       Rating: PlaylistRating
   }

   type MatchDetails {
       MatchId: String!
       SeasonId: String
       PlaylistId: String!
       Playlist: String!
       MapId: String!
       MatchStartDate: MatchDate!     
       PlayerMatchDuration: String!
       PlayerIndex: Int!
       LeaderId: Int!
       PlayerCompletedMatch: Boolean!
       PlayerMatchOutcome: Int!
       MapUrl: String!
       MapName: String!
       LastOnline: String!
       LastOnlineVal: Float!
       Time: Float!
       MatchEvents: MatchEvents
   }

   type SeasonMetadata {
       Identity: String
       DevIdentity: String
       Title: String
   }

   type MatchDate {
       ISO8601Date: String!
   }

   type MatchEvents {
        PlayerJoined: [PlayerJoined!]!
        BuildingQueued: [BuildingQueued!]!
        BuildingConstructionCompleted: [BuildingConstructionCompleted]!
        BuildingRecycled: [BuildingRecycled!]!
        BuildingUpgraded: [BuildingUpgraded!]!
        UnitTrained: [UnitTrained!]
        TechResearched: [TechResearched!]
        Death: [Death!]
        ResourceHeartbeat: ResourceHeartbeat!
    }

    type PlayerActivity {
        LastUpdateVal: Float!
        LastUpdated: String!
        Players: [MongoPlayer!]!
    }

    type MongoPlayer {
        _id: String!
        Playlist: String!
        LastOnline: String!
        LastOnlineVal: Float
    }

    # --------- PlayerJoinedMatch --------- #
    type PlayerJoined {
        PlayerIndex: Int!
        HumanPlayerId: Player!
        TeamId: Int!
        ComputerPlayerId: Int
        LeaderId: Int
        Leader: Leader
        TimeSinceStartMilliseconds: Int!
        EventName: String!
    }

    type Player {
        Gamertag: String!
    }

    type Leader {
        Id: Int! 
        Name: String! 
        Image: Image!
    }
    
    # --------- BuildingConstructionQueued --------- #
    type BuildingQueued {
        PlayerIndex: Int!
        BuildingId: String!
        InstanceId: Int!
        Location: Location!
        SupplyCost: Int!
        EnergyCost: Int!
        QueueLength: Int!
        ProvidedbByScenario: Boolean!
        TimeSinceStartMilliseconds: Int!
        EventName: String!
        Metadata: GAME_OBJECTS_METADATA!
    }

    # --------- Location --------- #
    type Location {
        x: Float!
        y: Float!
        z: Float!
    }

    # --------- BuildingConstructionCompleted --------- #
    type BuildingConstructionCompleted {
        PlayerIndex: Int!
        InstanceId: Int!
        TimeSinceStartMilliseconds: Int!
        EventName: String!
    }

    # --------- BuildingRecycled --------- #
    type BuildingRecycled {
        PlayerIndex: Int!
        InstanceId: Int!
        SupplyEarned: Int!
        EnergyEarned: Int!
        ProvidedbByScenario: Boolean!
        TimeSinceStartMilliseconds: Int!
        EventName: String!
    }
    
    # --------- BuildingUpgraded --------- #
    type BuildingUpgraded {
        PlayerIndex: Int!
        NewBuildingId: String!
        InstanceId: Int!
        SupplyCost: Int!
        EnergyCost: Int!
        TimeSinceStartMilliseconds: Int!
        EventName: String!
    }

    # --------- Death --------- #
    type Death {
        VictimPlayerIndex: Int
        VictimObjectTypeId: String
        VictimInstanceId: Int
        IsSuicide: Boolean
        TimeSinceStartMilliseconds: Int
        EventName: String
        VictimLocation: VictimLocation!
        Participants: Participant!
    }

    type VictimLocation {
        x: Float
        y: Float
        z: Float
    }

    type Participant {
        x: String # TODO: Fix Parse for participant
    }

    # ---- ResourceHeartbeat ---- #
    type ResourceHeartbeat {
        PlayerResources: PlayerResources!
    }

    type PlayerResources {
        P1: [Resources!]
        P2: [Resources!]
        P3: [Resources!]
        P4: [Resources!]
        P5: [Resources!]
        P6: [Resources!]
    }

    type Resources {
        Supply: Int
        TotalSupply: Float
        Energy: Int
        TotalEnergy: Float
        Population: Int
        PopulationCap: Int
        TechLevel: Int
        CommandPoints: Int
        TotalCommandPoints: Int
        CommandXP: Int
        TimeSinceStartMilliseconds: Int
    }

    # ---- UnitTrained ---- #

    type UnitTrained {
        PlayerIndex: Int
        SquadId: String
        SquadName: String
        InstanceId: Int
        CreatorInstanceId: Int
        SupplyCost: Int
        EnergyCost: Int
        PopulationCost: Int
        IsClone: Boolean
        ProvidedByScenario: Boolean
        TimeSinceStartMilliseconds: Int
        EventName: String
        SpawnLocation: SpawnLocation
        Dies: Boolean
        TimeTrained: Int
        TimeDeath: Int
    }

    type SpawnLocation {
        x: Float
        y: Float
        z: Float
    }

    # ---- TechResearched ---- #
    type TechResearched {
        PlayerIndex: Int
        TechId: String
        ResearcherInstanceId: Int
        SupplyCost: Int
        EnergyCost: Int
        ProvidedByScenario: Boolean
        TimeSinceStartMilliseconds: Int
        EventName: String
    }


    # --------- GAME_OBJECTS_METADATA --------- #
    type GAME_OBJECTS_METADATA {
        Identity: String!
        Autoroute: String!
        Title: String!
        HW2Object: HW2Object!
    }

    type HW2Object {
        ObjectTypeId: String!
        DisplayInfo: DisplayInfo!
        Image: Image!
    }

    # --------- DisplayInfo --------- #
    type DisplayInfo {
        Id: Int!
        Type: String!
        View: DisplayInfoView!
    }

    type DisplayInfoView {
        Status: String
        Identity: String
        Title: String
        HW2ObjectDisplayInfo: HW2ObjectDisplayInfo!
    }

    type HW2ObjectDisplayInfo {
        Name: String!
        Description: String!
    }

    # --------- Image --------- #
    type Image {
        Id: Int!
        Type: String!
        View: ImageInfo!
    }

    type ImageInfo {
        Status: String!
        Media: Media!
        Title: String!
        Identity: String!
    }
    
    # --------- Media --------- #
    type Media {
        MediaUrl: String!
        MimeType: String!
        Caption: String!
        AlternateText: String!
        FolderPath: String!
        FileName: String!
    }

    # --------- PlaylistRating --------- #
    type PlaylistRating {
        x1v1: Rating
        x2v2: Rating
        x3v3: Rating
    }
    
    # --------- Rating --------- #
    type Rating {
        Mmr: Mmr
        Csr: Csr
    }

    type Mmr {
        Rating: Float
        Variance: Float
    }

    type Csr {
        Tier: Int
        Designnation: Int
        Raw: Int
        PercentToNextTier: Int
        MeasurementMatchesRemaining: Int
        Rank: Int
    }
   `

// cov_bldg_supplyDepot_01
// unsc_bldg_fieldArmory_01