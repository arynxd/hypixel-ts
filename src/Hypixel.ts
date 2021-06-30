import AuthenticationConfig from "./internal/AuthenticationConfig";
import Requester from "./internal/Requester";
import Logger from "./util/Logger";
import RateLimiter from "./internal/RateLimiter";
import Player from "./model/Player";
import {Routes} from "./route/Route";
import EntityBuilder from "./internal/EntityBuilder";
import HypixelResponseError from "./exception/HypixelResponseError";
import {extractMessage} from "./util/error";
import Checks from "./util/Checks";
import Game from "./model/Game";

export default class Hypixel {
    private state = HypixelState.BUILT


    public readonly requester
    public readonly auth
    public readonly entityBuilder

    private _rateLimiter: RateLimiter | undefined
    private _ownerUuid: string | undefined
    private _owner: Player | undefined

    get rateLimiter(): RateLimiter {
        this.checkState(HypixelState.LOGGED_IN, "Cannot get rate limiter of a logged out instance")
        if (this._rateLimiter == null) {
            throw new TypeError("RateLimiter was null (this should not happen)")
        }
        return this._rateLimiter!!
    }

    get ownerUuid(): string {
        this.checkState(HypixelState.LOGGED_IN, "Cannot get owner UUID of a logged out instance")
        if (this._ownerUuid == null) {
            throw new TypeError("Owner UUID was null (this should not happen)")
        }
        return this._ownerUuid
    }

    get owner(): Player {
        this.checkState(HypixelState.LOGGED_IN, "Cannot get owner of a logged out instance")
        if (this._owner == null) {
            throw new TypeError("Owner was null (this should not happen)")
        }
        return this._owner
    }

    constructor(auth: AuthenticationConfig) {
        this.auth = auth
        this.requester = new Requester(this)
        this.entityBuilder = new EntityBuilder(this)
    }

    public async login() {
        this.checkState(HypixelState.BUILT, "Cannot start an already started instance")

        this.state = HypixelState.LOGGING_IN
        let authResult;

        try {
            authResult = await this.auth.validate(this)
        }
        catch (error) {
            throw new HypixelResponseError("Could not login with the token specified. \n\n" + extractMessage(error, Routes.KEY.url))
        }

        this.state = HypixelState.LOGGED_IN

        Logger.info(`Token validated. Owner: ${authResult.owner}.`)
        this._ownerUuid = authResult.owner
        this._rateLimiter = new RateLimiter(authResult)

        //this.fetchOwner().then(owner => this._owner = owner)
    }

    public logout() {
        this.checkState(HypixelState.LOGGED_IN, "Cannot logout a not logged in instance")
        this._ownerUuid = undefined
        this.state = HypixelState.SHUTDOWN
        this.requester.shutdown()
    }

    private checkState(state: HypixelState, message: string) {
        if (this.state != state) {
            throw Logger.error(new Error(`Expected state ${state} got ${this.state}. ${message}`))
        }
    }

    public async fetchOwner(): Promise<Player> {
        Checks.isUUID(this._ownerUuid, "Provided UUID")
        this.checkState(HypixelState.LOGGED_IN, "Cannot make requests from a logged out instance")
        const route = Routes.Player.GET.compile({ 'uuid': this._ownerUuid })
        return await this.requester.request<Player>(route, true, (data) => {
                return this.entityBuilder.createPlayer(data.player, this)
            }
        )
    }

    public async fetchPlayer(uuid: string): Promise<Player> {
        Checks.isUUID(uuid, "Provided UUID")
        this.checkState(HypixelState.LOGGED_IN, "Cannot make requests from a logged out instance")
        const route = Routes.Player.GET.compile({ 'uuid': uuid })
        return await this.requester.request<Player>(route, true, (data) => {
                return this.entityBuilder.createPlayer(data.player, this)
            }
        )
    }

    public async fetchRecentGamesById(uuid: string): Promise<Game[]> {
        Checks.isUUID(uuid, "Provided UUID")
        const route = Routes.Player.GET_RECENT_GAMES.compile({ 'uuid': uuid})
        return this.requester.request(route, true, data => {
            data = data.games
            const arr = []
            for (const game of data)
                arr.push(this.entityBuilder.createGame(game, undefined, this))
            return arr
        })
    }

    public async fetchFriendsById(uuid: string) {
        Checks.isUUID(uuid, "Provided UUID")
        const route = Routes.Player.GET_FRIENDS.compile({ 'uuid': uuid })
        const friends = this.requester.request<Promise<Player[]>>(route, true, async data => { //Array of promises representing all the fetched friends
            const arr: Promise<Player>[] = []
            for (const id of data.records) {
                const playerRoute = Routes.Player.GET.compile({ 'uuid': id })
                const req = this.requester.request<Player>(playerRoute, true, playerData => {
                    return this.entityBuilder.createPlayer(playerData, this)
                })
                arr.push(req)
            }
            return await Promise.all<Player>(arr)
        })
        return await friends
    }
}

export enum HypixelState {
    BUILT= "BUILT" ,
    LOGGING_IN = "LOGGING_IN",
    LOGGED_IN  = "LOGGED_IN",
    SHUTDOWN = "SHUTDOWN"
}
