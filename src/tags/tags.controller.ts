import { Get } from "@nestjs/common";
import { Controller } from '@nestjs/common';
import { TagsService } from "./tags.service";
import { ApiOkResponse } from "@nestjs/swagger";
import { TagListEntity } from "./entities/tag.entity";

@Controller('tags')
export class TagsController {
	constructor(private tagsService: TagsService) { }

	@Get()
	@ApiOkResponse({ type: TagListEntity })
	async getTags() {
		return new TagListEntity(await this.tagsService.findAll())
	}

}
