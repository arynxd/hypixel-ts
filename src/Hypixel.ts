import AuthenticationConfig from "./internal/AuthenticationConfig";
import Requester from "./internal/Requester";
import Logger from "./util/Logger";
import RateLimiter from "./internal/RateLimiter";
import Player from "./model/Player";
import {Routes} from "./route/Route";
import EntityBuilder from "./internal/EntityBuilder";

export default class Hypixel {
    private state = HypixelState.BUILT
    private ownerUuid: string | undefined
    private readonly requester


    public readonly auth
    public readonly entityBuilder
    public rateLimiter: RateLimiter | undefined

    constructor(auth: AuthenticationConfig) {
        this.auth = auth
        this.requester = new Requester(this)
        this.entityBuilder = new EntityBuilder(this)
    }

    public async login() {
        this.checkState(HypixelState.BUILT, "Cannot start an already started instance")

        this.state = HypixelState.LOGGING_IN
        const authResult = await this.auth.validate(this.requester)

        this.state = HypixelState.LOGGED_IN
        this.rateLimiter = new RateLimiter(authResult)

        Logger.info(`Token validated. Owner: ${authResult.owner}.`)
        this.ownerUuid = authResult.owner
    }

    private checkState(state: HypixelState, message: string) {
        if (this.state != state) {
            const err = new Error(`Invalid state ${state}. ${message}`)
            Logger.error(err)
            throw err
        }
    }

    public async fetchOwner(): Promise<Player> {
        this.checkState(HypixelState.LOGGED_IN, "Cannot make requests from a logged out instance")
        return await this.requester.request<Player>(Routes.Player.GET, {}, { 'uuid': this.ownerUuid }, true, (data) => {
                return this.entityBuilder.createPlayer(data.player)
            }
        )
    }

    public async fetchPlayer(uuid: string): Promise<Player> {
        this.checkState(HypixelState.LOGGED_IN, "Cannot make requests from a logged out instance")
        return await this.requester.request<Player>(Routes.Player.GET, {}, { 'uuid': uuid }, true, (data) => {
                return this.entityBuilder.createPlayer(data.player)
            }
        )
    }
}

export enum HypixelState {
    BUILT,
    LOGGING_IN,
    LOGGED_IN,
    SHUTDOWN
}
