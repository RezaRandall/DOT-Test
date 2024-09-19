import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Inject CacheManager
  ) {}

  // get all data
  async findAll(): Promise<Post[]> {
    console.log('Checking cache for posts...');

    // Cek apakah data ada di cache
    const cachedPosts = await this.cacheManager.get<Post[]>('posts');
    if (cachedPosts) {
      console.log('Data retrieved from cache:', cachedPosts);
      return cachedPosts;
    }

    console.log('Fetching data from API...');

    // Ambil data dari API dan simpan ke database
    const response = await lastValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/posts'),
    );
    const posts = response.data;

    console.log('Saving posts to the database...');
    await this.postRepository.save(posts);

    console.log('Saving data to cache...');

    // Simpan hasil ke cache dengan TTL 500 detik
    await this.cacheManager.set('posts', posts, 500);
    console.log('Data saved to cache');

    return posts; // Kembalikan posts langsung dari hasil API
  }

  // get data by ID
  async findOne(id: number): Promise<Post> {
    return this.postRepository.findOneBy({ id });
  }

  // create new data
  async create(post: Partial<Post>): Promise<Post> {
    try {
      console.log(post.userId);
      if (!post.userId || !post.title || !post.body) {
        throw new Error('Missing required fields');
      }

      const response = await lastValueFrom(
        this.httpService.post(
          'https://jsonplaceholder.typicode.com/posts',
          post,
        ),
      );
      const newPost = response.data;
      return await this.postRepository.save(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  // update data by ID
  async update(id: number, post: Partial<Post>): Promise<Post> {
    await this.httpService.axiosRef.put(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      post,
    );
    await this.postRepository.update(id, post);
    return this.postRepository.findOneBy({ id });
  }

  // delete data by ID
  async remove(id: number): Promise<void> {
    await this.httpService.axiosRef.delete(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    );
    await this.postRepository.delete(id);
  }
}
