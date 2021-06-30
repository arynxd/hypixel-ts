import {validate} from "uuid";

export default class Checks {
    public static isUUID(uuid: string | undefined, name: string) {
        if (!validate(uuid ?? "")) {
            throw new TypeError(`${name} could not be parsed to a valid UUID! Expected a UUID got ${uuid}`)
        }
    }
}