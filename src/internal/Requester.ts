import Hypixel from "../Hypixel";
import {CompiledRoute, RouteMethod} from "../route/Route";
import axios, {AxiosError, AxiosResponse} from "axios";
import Logger from "../util/Logger";
import RateLimitedError from "../exception/RateLimitedError";
import HypixelResponseError from "../exception/HypixelResponseError";
import {extractMessage} from "../util/error";
import RateLimiter from "./RateLimiter";

export default class Requester {
    private readonly api
    private canRequest = true

    constructor(api: Hypixel) {
        this.api = api
    }

    public shutdown() {
        this.canRequest = false
    }

    public async request<T>(
        route: CompiledRoute,
        checkRateLimits: boolean,
        fn: (data: any) => T
    ): Promise<T> {
        if (checkRateLimits && !this.api.rateLimiter.canTake()) {
            throw new RateLimitedError(`Encountered ratelimit on route ${route.url}`)
        }

        if (!this.canRequest) {
            throw new Error("The requester is shutdown, no new requests can be made!")
        }

        route.headers['Api-Key'] = this.api.auth.token

        const res = await Requester.doRequest(route)

        if (!res.data.success) {
            throw Logger.error(new Error(`Encountered error on route ${route.url}. Cause ${res.data.cause}`))
        }

        if (checkRateLimits) {
            this.api.rateLimiter.take()
        }

        return fn(res.data)
    }

    private static async doRequest(route: CompiledRoute): Promise<AxiosResponse> {
        let config: any = {'method': 'GET'};
        config.headers = route.headers
        config.data = route.body
        let promise: Promise<AxiosResponse>
        switch (route.method) {
            case RouteMethod.GET:
                config.method = "GET"
                promise = axios.get(route.url, config)
                break
            case RouteMethod.DELETE:
                config.method = "DELETE"
                promise = axios.delete(route.url, config)
                break
            default:
                throw Logger.error(new Error(`Invalid route method ${route.method}`))
        }

        try {
            return await axios.get(route.url, config)
        }
        catch (error) {
            throw this.formatError(error, route)
        }
    }
    private static formatError(error: AxiosError, route: CompiledRoute): HypixelResponseError {
        let message = extractMessage(error, route.url)

        const err = new HypixelResponseError(message)
        Logger.error(err)
        return err
    }
}
