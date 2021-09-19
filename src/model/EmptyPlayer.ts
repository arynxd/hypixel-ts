import Player from "./Player";
import Hypixel from "../Hypixel";

export default class EmptyPlayer extends Player {
    constructor(uuid: string, api: Hypixel) {
        super(
            uuid,
            "",
            "",
            "",
            "",
            "",
            -1,
            -1,
            -1,
            {},
            [],
            api
        );
    }
}