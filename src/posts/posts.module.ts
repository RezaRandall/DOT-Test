import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    HttpModule,
    CacheModule.register({
      ttl: 500, // waktu cache hidup dalam detik
      max: 1000, // jumlah maksimum item cache
    }),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
