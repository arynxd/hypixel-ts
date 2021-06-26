import {formatString} from "../util/string";

export class CompiledRoute {
    public readonly url
    public readonly method

    constructor(route: Route, ...params: string[]) {
        this.url = formatString(route.url, ...params)
        this.method = route.method
    }
}

export enum RouteMethod {
    POST,
    GET,
    DELETE,
    PATCH
}

class Route {
    public readonly url
    public readonly method

    constructor(url: string, method: RouteMethod) {
        this.url = url
        this.method = method
    }
}

export class Routes {
    public static readonly BASE_URL = "https://api.hypixel.net"
    public static readonly KEY = new Route(Routes.BASE_URL + "/key", RouteMethod.GET)

    public static readonly Player = class {
        public static readonly GET = new Route(Routes.BASE_URL + "/player", RouteMethod.GET)
    }
}
