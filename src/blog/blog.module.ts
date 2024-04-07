import { Module } from '@nestjs/common';
import { Blog } from './blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog-controller';
import { BlogService } from './blog.service';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Blog, User, Category]),
    ConfigModule],
    controllers: [BlogController],
    providers: [BlogService]
})
export class BlogModule {}
