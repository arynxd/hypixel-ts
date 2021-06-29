import Authentication from "../model/Authentication";
import RateLimitedError from "../exception/RateLimitedError";

export default class RateLimiter {
    private static readonly MINUTE = 60 * 1000

    private remaining
    private total
    private lastUsed

    constructor(auth: Authentication) {
        this.remaining = auth.limit - auth.queriesInPastMin
        this.total = auth.totalQueries
        this.lastUsed = Date.now()
    }

    public canTake(): boolean {
        return this.remaining > 0
    }

    public take() {
        if (!this.canTake()) {
            throw new RateLimitedError("RateLimit exceeded")
        }
        this.remaining--
        if (this.lastUsed > (Date.now() - RateLimiter.MINUTE)) {
            this.lastUsed = Date.now()
        }
    }
}