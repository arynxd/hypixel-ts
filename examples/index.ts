import HypixelBuilder from "../src/HypixelBuilder"
import {readFileSync} from "fs";

const key = readFileSync('secrets/token.txt').toString()
const hypixel = new HypixelBuilder(key).build();

const main = async () => {
    await hypixel.login()
    const games = await hypixel.fetchFriendsById(hypixel.ownerUuid)
}

main().catch(err => console.error(err))