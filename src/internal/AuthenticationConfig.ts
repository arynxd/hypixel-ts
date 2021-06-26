import Authentication from "../model/Authentication";
import Requester from "./Requester";
import {CompiledRoute, Routes} from "../route/Route";

export default class AuthenticationConfig {
    public readonly token

    constructor(token: string) {
        this.token = token
    }

    public async validate(requester: Requester): Promise<Authentication> {
        const route = new CompiledRoute(Routes.KEY)
        return await requester.request<Authentication>(route, {}, {}, false, (data) => {
            data = data.record
            return {
                key: data.key,
                limit: data.limit,
                owner: data.owner,
                queriesInPastMin: data.queriesInPastMin,
                totalQueries: data.totalQueries
            }
        })
    }
}
