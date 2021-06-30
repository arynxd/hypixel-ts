import Hypixel from "./Hypixel";
import AuthenticationConfig from "./internal/AuthenticationConfig";
import Checks from "./util/Checks";

export default class HypixelBuilder {
    private readonly token
    constructor(token: string) {
        this.token = token
    }

    private verify() {
        Checks.isUUID(this.token, "Token")
    }
    public build(): Hypixel {
        this.verify()
        return new Hypixel(new AuthenticationConfig(this.token))
    }
}