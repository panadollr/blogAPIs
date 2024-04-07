import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Like, Repository } from "typeorm";
import { create } from "domain";
import * as bcrypt from 'bcrypt';
import { FilterUserDto } from "./dtos/filter-user-dto";
import { RegisterUserDto } from "src/auth/dtos/register-user-dto";

@Injectable()
export class UserService {
 constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}
 

  async create(dto: RegisterUserDto):Promise<{ message: string, data: User }> {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });

    if (existingUser) {
        throw new Error('Email already exists');
    }

    const user = this.userRepository.create(dto);
    
    const newUser = await this.userRepository.save(user);
    return { message: 'Thêm user thành công', data: newUser };
    }


    async update(id: number, dto: RegisterUserDto): Promise<{ message: string, data: User }> {
      const existingUser = await this.userRepository.findOneBy({id:id});
  
      if (!existingUser) {
        throw new HttpException(`Không tìm thấy user có ID = ${id}.`, HttpStatus.NOT_FOUND);
      }
  
      existingUser.name = dto.name;
      existingUser.email = dto.email;
      existingUser.password = dto.password; 
  
      const updatedUser = await this.userRepository.save(existingUser);
      
      return { message: 'Cập nhật user thành công', data: updatedUser };
  }


    async findAll(query: FilterUserDto): Promise<any> {
        const page = Number(query.page) || 1;
        const items_per_page = Number(query.items_per_page) || 24;
        const skip = (page - 1) * items_per_page;
        const keyword = query.search || '';
        const [res, total] = await this.userRepository.findAndCount({
          where: [
            {name:Like('%'+keyword+'%')},
            {email:Like('%'+keyword+'%')}
          ],
          order: {created_at: "DESC"},
          take: items_per_page,
          skip: skip
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
  

  async findDetail(id:number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new HttpException(`Không tìm thấy user có ID = ${id}.`, HttpStatus.NOT_FOUND);
    }
  
    return user;
  }


  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Không tìm thấy user cần xóa', HttpStatus.NOT_FOUND);
    }
  }    

}
