import Hypixel from "../Hypixel";
import Player from "../model/Player";

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
}