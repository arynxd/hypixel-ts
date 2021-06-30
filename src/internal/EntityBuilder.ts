import Hypixel from "../Hypixel";
import Player from "../model/Player";
import Game from "../model/Game";
import GameType from "../model/GameType";

export default class EntityBuilder {
    private readonly api

    constructor(api: Hypixel) {
        this.api = api
    }

    public createPlayer(data: any, api: Hypixel): Player {
        return new Player(
            data.uuid,
            data.displayname,
            data.rank,
            data.packageRank,
            data.newPackageRank,
            data.monthlyPackageRank,
            data.firstLogin,
            data.lastLogin,
            data.lastLogout,
            data.stats ?? {},
            data.friends ?? [],
            api
        )
    }

    public createGame(data: any, player: Player | undefined, api: Hypixel): Game {
        return {
            date: data.date,
            ended: data.ended,
            gameType: GameType.valueOf(data.gameType) ?? GameType.UNKNOWN,
            map: data.map,
            mode: data.mode,
            player: player
        }
    }
}