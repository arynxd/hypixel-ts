export default class Logger {
    public static isDebug = false

    public static debug(message: string) {
        if (Logger.isDebug) {
            console.log("[DEBUG] [HYPIXEL] " + message)
        }
    }

    public static info(message: string) {
        console.log("[INFO] [HYPIXEL] " + message)
    }

    public static error(err: Error): Error {
        console.error("[ERR] [HYPIXEL] " + err.message)
        return err
    }
}