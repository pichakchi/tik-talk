export interface Communities {
	id: number
	admin: {
		id: number
		username: string
		avatarUrl: string
		subscribersAmount: number
		firstName: string
		lastName: string
		isActive: boolean
		stack: string[]
		city: string
		description: string
	}
	name: string
	themes: string[]
	tags: string[]
	bannerUrl: string | null
	avatarUrl: string | null
	description: string
	subscribersAmount: number
	createdAt: string
	isJoined: boolean
}
