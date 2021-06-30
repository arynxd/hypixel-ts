export class CompiledRoute {
    public readonly url
    public readonly method
    public readonly headers
    public readonly body

    constructor(route: Route, headers: any, body: any, url: string) {
        this.url = url
        this.method = route.method
        this.headers = headers
        this.body = body
    }
}

export class RouteMethod {
    public static readonly GET = "GET"
    public static readonly DELETE = "DELETE"
    public static readonly PATCH = "DELETE"
    public static readonly POST = "POST"
}

class Route {
    public readonly url
    public readonly method
    public readonly paramCount

    constructor(url: string, method: RouteMethod, paramCount: number) {
        this.url = url
        this.method = method
        this.paramCount = paramCount
    }

    public compile(body: any = {}, headers: any = {}): CompiledRoute {
        const len = Object.keys(body).length
        if (len != this.paramCount) {
            throw new Error(`Invalid param count for route ${this.url}. Expected ${this.paramCount} got ${len}`)
        }

        return new CompiledRoute(this, headers, body, this.url)
    }
}

export class Routes {
    public static readonly BASE_URL = "https://api.hypixel.net"
    public static readonly KEY = new Route(Routes.BASE_URL + "/key", RouteMethod.GET, 0)

    public static readonly Player = class {
        public static readonly GET = new Route(Routes.BASE_URL + "/player", RouteMethod.GET, 1)
        public static readonly GET_FRIENDS = new Route(Routes.BASE_URL + "/friends", RouteMethod.GET, 1)
        public static readonly GET_RECENT_GAMES = new Route(Routes.BASE_URL + "/recentgames", RouteMethod.GET, 1)
    }
}
