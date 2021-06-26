import Hypixel from "../Hypixel";
import Player from "../model/Player";

export default class EntityBuilder {
    private readonly api
    constructor(api: Hypixel) {
        this.api = api
    }

    public createPlayer(data: any): Player {
        return {
                uuid: data.uuid,
                displayName: data.displayname,
                rank: data.rank,
                packageRank: data.packageRank,
                newPackageRank: data.newPackageRank,
                monthlyPackageRank: data.monthlyPackageRank,
                firstLogin: data.firstLogin,
                lastLogin: data.lastLogin,
                lastLogout: data.lastLogout,
                stats: data.stats ?? { },
                friends: data.friends ?? []
            }
    }
}