

export default interface Player {
    uuid: string
    displayName: string
    rank: string
    packageRank: string
    newPackageRank: string
    monthlyPackageRank: string
    firstLogin: number
    lastLogin: number
    lastLogout: number
    stats: object,
    friends: Player[]
}