import Authentication from "../model/Authentication";
import {Routes} from "../route/Route";
import Hypixel from "../Hypixel";

export default class AuthenticationConfig {
    public readonly token

    constructor(token: string) {
        this.token = token
    }

    public async validate(api: Hypixel): Promise<Authentication> {
        const route = Routes.KEY.compile()
        return await api.requester.request<Authentication>(route, false, (data) => {
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
