import GameType from "./GameType";
import Player from "./Player";

export default interface Game {
    date: number
    gameType: GameType
    mode: string
    map: string
    ended: number,
    player: Player
}