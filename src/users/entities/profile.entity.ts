import { ApiHideProperty, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { Prisma, User } from '@prisma/client'
import { Exclude } from 'class-transformer'
import { IsBoolean, IsOptional, isString } from 'class-validator'

export class ProfileEntity {
	@ApiHideProperty()
	@Exclude()
	email: string

	@ApiHideProperty()
	@Exclude()
	token: string | undefined

	@ApiProperty()
	username: string

	@ApiProperty()
	bio: string

	@ApiProperty()
	image: string | null

	@ApiHideProperty()
	@Exclude()
	password: string

	@ApiHideProperty()
	@Exclude()
	id: number

	@ApiProperty()
	@IsBoolean()
	following: boolean

	constructor(user: Partial<User>, isFollowing: boolean) {
		Object.assign(this, user)
		this.following = isFollowing
	}
}

export const ProfileResponseSchema = {
	schema: {
		type: 'object',
		properties: {
			profile: {
				$ref: getSchemaPath(ProfileEntity),
			}
		}
	}
}