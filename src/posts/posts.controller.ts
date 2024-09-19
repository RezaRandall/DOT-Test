import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Post()
  async create(@Body() post: Partial<PostEntity>): Promise<PostEntity> {
    console.log('Received post data:', post);
    if (!post.userId || !post.title || !post.body) {
      throw new Error('Missing required fields');
    }
    return this.postsService.create(post);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() post: Partial<PostEntity>,
  ): Promise<PostEntity> {
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.postsService.remove(id);
  }
}
