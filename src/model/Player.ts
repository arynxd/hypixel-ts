import Hypixel from "../Hypixel";
import {Routes} from "../route/Route";
import Game from "./Game";

export default class Player {
    public readonly uuid
    public readonly displayName
    public readonly rank
    public readonly packageRank
    public readonly newPackageRank
    public readonly monthlyPackageRank
    public readonly firstLogin
    public readonly lastLogin
    public readonly lastLogout
    public readonly stats
    public readonly friends

    public readonly api

    constructor(
        uuid: string,
        displayName: string,
        rank: string,
        packageRank: string,
        newPackageRank: string,
        monthlyPackageRank: string,
        firstLogin: number,
        lastLogin: number,
        lastLogout: number,
        stats: object,
        friends: Player[],
        api: Hypixel
    ) {
        this.uuid = uuid
        this.displayName = displayName
        this.rank = rank
        this.packageRank = packageRank
        this.newPackageRank = newPackageRank
        this.monthlyPackageRank = monthlyPackageRank
        this.firstLogin = firstLogin
        this.lastLogin = lastLogin
        this.lastLogout = lastLogout
        this.stats = stats
        this.friends = friends
        this.api = api
    }

    public async fetchFriends(): Promise<Player[]> {
        const route = Routes.Player.GET_FRIENDS.compile({ 'uuid': this.uuid })
        const friends = this.api.requester.request<Promise<Player[]>>(route, true, async data => { //Array of promises representing all the fetched friends
            const arr: Promise<Player>[] = []
            for (const id of data.records) {
                const playerRoute = Routes.Player.GET.compile({ 'uuid': id })
                const req = this.api.requester.request<Player>(playerRoute, true, playerData => {
                    return this.api.entityBuilder.createPlayer(playerData, this.api)
                })
                arr.push(req)
            }
            return await Promise.all<Player>(arr)
        })
        return await friends
    }

    public async fetchRecentGames(): Promise<Game[]> {
        const route = Routes.Player.GET_RECENT_GAMES.compile({ 'uuid': this.uuid })
        return this.api.requester.request(route, true, data => {
            data = data.games
            const arr = []
            for (const game of data)
                arr.push(this.api.entityBuilder.createGame(game, this, this.api))
            return arr
        })
    }
}