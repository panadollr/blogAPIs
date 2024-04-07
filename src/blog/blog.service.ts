import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Blog } from "./blog.entity";
import { CreateBlogDto } from "./dtos/create-blog-dto";
import { User } from "src/user/user.entity";
import { Category } from "src/category/category.entity";
import { FilterBlogDto } from "./dtos/filter-blog-dto";
import { take } from "rxjs";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
 
    async create(dto: CreateBlogDto, userId:number, categoryId:number):Promise<{ message: string, data: Blog }> {
      const user = await this.userRepository.findOneBy({id:userId});
      const category = await this.categoryRepository.findOneBy({id:categoryId});
      if (!category) {
        throw new HttpException('Không tìm thấy danh mục hợp lệ !', HttpStatus.NOT_FOUND);
    }

      const existingBlog = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.slug = :slug OR blog.title = :title', { slug: dto.slug, title: dto.title })
      .getOne();

      if (existingBlog) {
        let message = 'Slug của bài viết này đã tồn tại';
        if (existingBlog.title === dto.title) {
          message = 'Tiêu đề của bài viết này đã tồn tại';
        }
        if (existingBlog.slug === dto.slug && existingBlog.title === dto.title) {
          message = 'Slug và tiêu đề của bài viết này đã tồn tại';
        }
  
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }

      try {
        const newbBlog = await this.blogRepository.save({
          ...dto,
          user:user,
          category:category
        })
        return { message: 'Tạo bài viết thành công', data: newbBlog };
      } catch (error) {
        throw new HttpException('Không thể tạo bài viết', HttpStatus.BAD_REQUEST);
      }
    }

    
    async update(blogId: number, dto: CreateBlogDto, userId: number, categoryId: number): Promise<{ message: string, data: Blog }> {
      const user = await this.userRepository.findOneBy({ id: userId });
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        throw new HttpException('Không tìm thấy danh mục hợp lệ !', HttpStatus.NOT_FOUND);
      }

      // Đầu tiên, tìm blog hiện tại để đảm bảo nó tồn tại
      const currentBlog = await this.blogRepository.findOneBy({ id:blogId });
      if (!currentBlog) {
        throw new HttpException('Bài viết này không tồn tại', HttpStatus.NOT_FOUND);
      }

      try {
      // Cập nhật blog với dữ liệu mới
      const updated = await this.blogRepository.save({
        ...currentBlog, // Sao chép dữ liệu hiện tại
        ...dto, // Ghi đè bằng dữ liệu mới từ dto
        user:user,
        category:category
      });

      return { message: 'Cập nhật blog thành công', data: updated }; 
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }


    async delete(id: number): Promise<void> {
      const result = await this.blogRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('Không tìm thấy blog cần xóa', HttpStatus.NOT_FOUND);
      }
    }     


    async findAll(query: FilterBlogDto): Promise<any> {
      const page = Number(query.page) || 1;
      const items_per_page = Number(query.items_per_page) || 24;
      const skip = (page - 1) * items_per_page;
      const keyword = query.search || '';
      const [res, total] = await this.blogRepository.findAndCount({
        where: [
          {title:Like('%'+keyword+'%')},
          {slug:Like('%'+keyword+'%')},
          {content:Like('%'+keyword+'%')}
        ],
        order: {created_at: "DESC"},
        take: items_per_page,
        skip: skip,
        relations:{
          user: true,
          category: true,   
        },
        select:{
          user: {id:true, name:true, email:true},
          category: {id:true, name:true, slug:true}
        }
    });

      const lastPage = Math.ceil(total/items_per_page);
      const nextPage = page + 1 > lastPage ? null: page + 1;
      const prevPage = page - 1 < 1 ? null: page - 1;

      return {
        data: res,
        total,
        currentPage: page,
        nextPage,
        prevPage,
        lastPage
      }
} 


  async findDetail(id:number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id: id },
      relations: ['user', 'category'],
      select: {
        user: {id: true, name: true, email: true},
        category: {id: true, name: true, slug: true}
      }
    });

    if (!blog) {
      throw new HttpException(`Không tìm thấy bài viết có ID = ${id}.`, HttpStatus.NOT_FOUND);
    }
  
    return blog;
  }

}
