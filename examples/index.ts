import HypixelBuilder from "../src/HypixelBuilder"
import {readFileSync} from "fs";

const key = readFileSync('secrets/token.txt').toString()
const hypixel = new HypixelBuilder(key).build()

const main = async () => {
    await hypixel.login()
    const me = await hypixel.fetchOwner()
    console.log(me.displayName)
    const myFriends = await me.fetchFriends()
    console.log(myFriends)
}
main().catch(err => console.log(err))