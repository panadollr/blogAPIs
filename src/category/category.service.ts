import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dtos/create-category-dto";

@Injectable()
export class CategoryService {
 constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>){}
 
    async create(dto: CreateCategoryDto) {
        let message = '';
        const existingNameCategory = await this.categoryRepository.findOneBy({ name: dto.name });
        if (existingNameCategory) {
            message += 'Tên danh mục đã tồn tại';
        }
        const existingSlugCategory = await this.categoryRepository.findOneBy({ slug: dto.slug });
        if (existingSlugCategory) {
            message += 'Slug danh mục đã tồn tại.';
        }

        if (existingNameCategory || existingSlugCategory) {
            throw new ConflictException(message.trim());
        }

        const category = this.categoryRepository.create(dto);
        return await this.categoryRepository.save(category);
    }


    async update(id: number, dto: CreateCategoryDto) {
        const existingCategory = await this.categoryRepository.findOneBy({id:id});

        if (!existingCategory) {
            throw new NotFoundException('Category not found');
        }

        const existingNameCategory = await this.categoryRepository.findOne({ where: { name: dto.name, id: Not(id) } });
        if (existingNameCategory) {
            throw new ConflictException('Có danh mục có cùng tên đã tồn tại');
        }
    
        const existingSlugCategory = await this.categoryRepository.findOne({ where: { slug: dto.slug, id: Not(id) } });
        if (existingSlugCategory) {
            throw new ConflictException('Có danh mục có cùng slug đã tồn tại');
        }
    
        existingCategory.name = dto.name;
        existingCategory.slug = dto.slug;
    
        return await this.categoryRepository.save(existingCategory);
    }


    async delete(id: number): Promise<void> {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) {
          throw new HttpException('Không tìm thấy danh mục cần xóa', HttpStatus.NOT_FOUND);
        }
      }  


    find() {
    return this.categoryRepository.find({ where: {id: 1 }});
    }
    
    async findBlogsByCategorySlug(slug: string) {
        const category = await this.categoryRepository.findOneBy({ slug: slug });

        if (!category) {
        throw new HttpException('Không tìm thấy danh mục', HttpStatus.NOT_FOUND);
        }

        const blogs = await category.blogs;

        return blogs;
      }

}
