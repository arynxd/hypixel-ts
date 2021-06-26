export default interface Authentication {
    key: string
    owner: string
    limit: number
    queriesInPastMin: number
    totalQueries: number
}