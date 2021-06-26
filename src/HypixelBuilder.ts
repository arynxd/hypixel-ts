import Hypixel from "./Hypixel";
import AuthenticationConfig from "./internal/AuthenticationConfig";

export default class HypixelBuilder {
    private readonly token
    constructor(token: string) {
        this.token = token
    }

    public build(): Hypixel {
        return new Hypixel(new AuthenticationConfig(this.token))
    }
}