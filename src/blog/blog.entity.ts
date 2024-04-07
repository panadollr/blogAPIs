import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm';

@Entity({ name: 'blogs'})
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  view: number; 

  @Column()
  seo_title: string;

  @Column()
  seo_description: string;
  
  @Column()
  seo_keyword: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.blogs) // Relationship with Category
  user: User;

  @ManyToOne(() => Category, category => category.blogs) // Relationship with Category
  category: Category;
}