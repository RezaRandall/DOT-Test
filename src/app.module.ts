import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 500, // TTL diperpanjang untuk pengujian lebih mudah
      max: 1000, // jumlah maksimum item cache
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'test.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    HttpModule,
    PostsModule,
  ],
})
export class AppModule {}
