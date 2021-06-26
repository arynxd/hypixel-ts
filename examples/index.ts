import HypixelBuilder from "../src/HypixelBuilder"

const key = "your-token"
const hypixel = new HypixelBuilder(key).build()

const main = async () => {
    await hypixel.login()
    const me = await hypixel.fetchOwner()
    console.log(me.displayName)
}
main().catch(err => console.log(err))