import { Blog } from 'src/blog/blog.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';

@Entity({ name: 'categories'})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  seo_title: string;

  @Column()
  seo_description: string;

  @Column()
  seo_keyword: string;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[]
}