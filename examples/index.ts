import HypixelBuilder from "../src/HypixelBuilder"
import {readFileSync} from "fs";
import axios from "axios";

const key = readFileSync('secrets/token.txt').toString()
const hypixel = new HypixelBuilder(key).build();

const main = async () => {
    await hypixel.login()
    const me = await hypixel.fetchOwner()
    console.log(me.displayName)
}

main().catch(err => console.error(err))
