import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'biql50xz4ylcjrtlxjnu-mysql.services.clever-cloud.com',
      port: 3306,
      username: 'usytlqieelbvaoa8',
      password: 'Q7Uj0fExr0oBtslqFOuR',
      database: 'biql50xz4ylcjrtlxjnu',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    BlogModule,
    CategoryModule,
    ConfigModule.forRoot()
  ]
})
export class AppModule {}
