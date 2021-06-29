import AuthenticationConfig from "./internal/AuthenticationConfig";
import Requester from "./internal/Requester";
import Logger from "./util/Logger";
import RateLimiter from "./internal/RateLimiter";
import Player from "./model/Player";
import {Routes} from "./route/Route";
import EntityBuilder from "./internal/EntityBuilder";
import HypixelResponseError from "./exception/HypixelResponseError";
import {extractMessage} from "./util/error";

export default class Hypixel {
    private state = HypixelState.BUILT
    private ownerUuid: string | undefined

    public readonly requester
    public readonly auth
    public readonly entityBuilder

    private _rateLimiter: RateLimiter | undefined

    get rateLimiter(): RateLimiter {
        this.checkState(HypixelState.LOGGED_IN, "Cannot get rate limiter of a logged out instance")
        return this._rateLimiter!!
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
        this.ownerUuid = authResult.owner
        this._rateLimiter = new RateLimiter(authResult)
    }

    public logout() {
        this.checkState(HypixelState.LOGGED_IN, "Cannot logout a not logged in instance")
        this.ownerUuid = undefined
        this.state = HypixelState.SHUTDOWN
        this.requester.shutdown()
    }

    private checkState(state: HypixelState, message: string) {
        if (this.state != state) {
            const err = new Error(`Expected state ${state} got ${this.state}. ${message}`)
            Logger.error(err)
            throw err
        }
    }

    public async fetchOwner(): Promise<Player> {
        this.checkState(HypixelState.LOGGED_IN, "Cannot make requests from a logged out instance")
        const route = Routes.Player.GET.compile({ 'uuid': this.ownerUuid })
        return await this.requester.request<Player>(route, true, (data) => {
                return this.entityBuilder.createPlayer(data.player, this)
            }
        )
    }

    public async fetchPlayer(uuid: string): Promise<Player> {
        this.checkState(HypixelState.LOGGED_IN, "Cannot make requests from a logged out instance")
        const route = Routes.Player.GET.compile({ 'uuid': uuid })
        return await this.requester.request<Player>(route, true, (data) => {
                return this.entityBuilder.createPlayer(data.player, this)
            }
        )
    }
}

export enum HypixelState {
    BUILT= "BUILT" ,
    LOGGING_IN = "LOGGING_IN",
    LOGGED_IN  = "LOGGED_IN",
    SHUTDOWN = "SHUTDOWN"
}
