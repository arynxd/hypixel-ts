import Hypixel from "../Hypixel";
import {CompiledRoute, RouteMethod} from "../route/Route";
import axios, {AxiosResponse} from "axios";
import Logger from "../util/Logger";
import RateLimitedError from "../exception/RateLimitedError";
import RateLimiter from "./RateLimiter";
import HypixelResponseError from "../exception/HypixelResponseError";

export default class Requester {
    private readonly api

    constructor(api: Hypixel) {
        this.api = api
    }

    public async request<T>(
        route: CompiledRoute,
        headers: any | undefined = undefined,
        body: any | undefined = undefined,
        checkRateLimits: boolean = true,
        fn: (data: any) => T
    ): Promise<T> {
        if (!this.api.rateLimiter?.canTake() && checkRateLimits) {
            throw new RateLimitedError(`Encountered ratelimit on route ${route.url}`)
        }

        headers['Api-Key'] = this.api.auth.token

        let res
        switch (route.method) {
            case RouteMethod.GET:
                res = await Requester.get(route, headers, body)
                break
            default:
                const err = new Error(`Invalid route method ${route.method}`)
                Logger.error(err)
                throw err
        }

        if (!res.data.success) {
            const err = new Error(`Encountered error on route ${route.url}. Cause ${res.data.cause}`)
            Logger.error(err)
            throw err
        }

        this.api.rateLimiter?.take()

        return fn(res.data)
    }

    private static async get(route: CompiledRoute, headers: any| undefined, body: any | undefined): Promise<AxiosResponse> {
        try {
            return await axios.get(route.url, {
                    headers: headers,
                    method: "GET",
                    params: body
                }
            )
        }
        catch (error) {
            const err = new HypixelResponseError(`Encountered error on route ${route.url}: ${error.message}`)
            Logger.error(err)
            throw err
        }
    }
}