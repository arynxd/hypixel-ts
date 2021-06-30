export default class GameType {
    //INSTANCES
    public static readonly QUAKECRAFT     = new GameType(2, "QUAKECRAFT", "Quake", "Quake")
    public static readonly WALLS        = new GameType(3, "WALLS", "Walls", "Walls")
    public static readonly PAINTBALL      = new GameType(4, "PAINTBALL", "Paintball", "Paintball")
    public static readonly SURVIVAL_GAMES = new GameType(5, "SURVIVAL_GAMES ", "HungerGames", "Blitz Survival Games")
    public static readonly TNTGAMES       = new GameType(6, "TNTGAMES", "TNTGames", "TNT Games")
    public static readonly VAMPIREZ       = new GameType(7, "VAMPIREZ", "VampireZ", "VampireZ")
    public static readonly WALLS3         = new GameType(13, "WALLS3", "Walls3", "Mega Walls")
    public static readonly ARCADE         = new GameType(14, "ARCADE", "Arcade ", "Arcade")
    public static readonly ARENA          = new GameType(17, "ARENA", "Arena", "Arena")
    public static readonly UHC            = new GameType(20, "UHC", "UHC ", "UHC Champions")
    public static readonly MCGO           = new GameType(21, "MCGO", "MCGO", "Cops and Crims")
    public static readonly BATTLEGROUND   = new GameType(23, "BATTLEGROUND", "Battleground ", "Warlords")
    public static readonly SUPER_SMASH    = new GameType(24, "SUPER_SMASH ", "SuperSmash", "Smash Heroes")
    public static readonly GINGERBREAD    = new GameType(25, "GINGERBREAD", "GingerBread ", "Turbo Kart Racers")
    public static readonly HOUSING        = new GameType(26, "HOUSING", "Housing ", "Housing")
    public static readonly SKYWARS        = new GameType(51, "SKYWARS", "SkyWars", "SkyWars")
    public static readonly TRUE_COMBAT    = new GameType(52, "TRUE_COMBAT", "TrueCombat", "Crazy Walls")
    public static readonly SPEED_UHC      = new GameType(54, "SPEED_UHC ", "SpeedUHC ", "Speed UHC")
    public static readonly SKYCLASH       = new GameType(55, "SKYCLASH", "SkyClash", "SkyClash")
    public static readonly LEGACY         = new GameType(56, "LEGACY", "Legacy", "Classic Games")
    public static readonly PROTOTYPE      = new GameType(57, "PROTOTYPE", "	Prototype", "Prototype")
    public static readonly BEDWARS        = new GameType(58, "BEDWARS", "Bedwars", "Bed Wars")
    public static readonly MURDER_MYSTERY = new GameType(59, "MURDER_MYSTERY", "MurderMystery", "Murder Mystery")
    public static readonly BUILD_BATTLE   = new GameType(60, "BUILD_BATTLE", "BuildBattle ", "Build Battle")
    public static readonly DUELS          = new GameType(61, "DUELS", "Duels", "Duels")
    public static readonly SKYBLOCK       = new GameType(63, "SKYBLOCK", "SkyBlock", "SkyBlock")
    public static readonly PIT            = new GameType(64, "PIT", "Pit", "Pit")
    public static readonly REPLAY         = new GameType(65, "REPLAY", "Replay", "Replay")
    public static readonly SMP            = new GameType(67, "SMP", "SMP", "SMP")

    public static readonly UNKNOWN        = new GameType(-1,"", "", "")

    public static readonly ALL            = [
        GameType.QUAKECRAFT,
        GameType.WALLS,
        GameType.PAINTBALL,
        GameType.SURVIVAL_GAMES,
        GameType.TNTGAMES,
        GameType.VAMPIREZ,
        GameType.ARCADE,
        GameType.ARENA,
        GameType.UHC,
        GameType.MCGO,
        GameType.BATTLEGROUND,
        GameType.SUPER_SMASH,
        GameType.GINGERBREAD,
        GameType.HOUSING,
        GameType.SKYWARS,
        GameType.TRUE_COMBAT,
        GameType.SPEED_UHC,
        GameType.SKYCLASH,
        GameType.LEGACY,
        GameType.PROTOTYPE,
        GameType.BEDWARS,
        GameType.MURDER_MYSTERY,
        GameType.BUILD_BATTLE,
        GameType.DUELS,
        GameType.SKYBLOCK,
        GameType.PIT,
        GameType.REPLAY,
        GameType.SMP
    ]

    public readonly id
    public readonly name
    public readonly dbName
    public readonly displayName

    constructor(id: number, name: string, dbName: string, displayName: string) {
        this.id = id
        this.name = name
        this.dbName = displayName
        this.displayName = displayName
    }

    public static valueOf(input: string): GameType | undefined {
        for (const game of GameType.ALL) {
            if (game.name == input || game.dbName == input || game.displayName == input)
                return game
        }
        return undefined
    }
}
