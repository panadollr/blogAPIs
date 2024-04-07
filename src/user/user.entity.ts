import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Blog } from 'src/blog/blog.entity';

@Entity({ name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({nullable:true, default:null})
  refresh_token: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    const saltOrRounds = 10;
    this.password = await bcrypt.hash(this.password, saltOrRounds);
}

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

@OneToMany(() => Blog, (blog) => blog.user) // Relationship with Category
blogs: Blog[];
}