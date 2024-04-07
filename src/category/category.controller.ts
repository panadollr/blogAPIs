import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dtos/create-category-dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags('Categories')
@Controller('categories')
export class CategoryController{
    constructor(private readonly categoryService: CategoryService){}

    @Post("create")
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Thêm danh mục' })
    @ApiResponse({ status: 201, description: 'Danh mục được tạo thành công.' })
    @ApiResponse({
        status: 400,
        description: 'Yêu cầu không hợp lệ do thông tin đầu vào không đủ hoặc sai.',
        schema: {
          example: {
            message: 'Slug của danh mục này đã tồn tại hoặc Tên của danh mục này đã tồn tại.',
          },
        },
      })
      @ApiResponse({
        status: 401,
        description: 'Chưa xác thực. Cần phải đăng nhập.',
        schema: {
          example: {
            message: 'Unauthorized',
          },
        },
      })
    create(@Body() dto: CreateCategoryDto){
        return this.categoryService.create(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post("update/:id")
    @ApiOperation({ summary: 'Cập nhật danh mục' })
    @ApiResponse({ status: 201, description: 'Danh mục được cập nhật thành công.' })
    @ApiResponse({
        status: 400,
        description: 'Yêu cầu không hợp lệ do thông tin đầu vào không đủ hoặc sai.',
        schema: {
          example: {
            message: 'Tên hoặc slug của danh mục đã tồn tại.',
          },
        },
      })
      @ApiResponse({
        status: 401,
        description: 'Chưa xác thực. Cần phải đăng nhập.',
        schema: {
          example: {
            message: 'Unauthorized',
          },
        },
      })
    update(@Param('id') id: number, @Body() dto: CreateCategoryDto){
        return this.categoryService.update(id, dto);
    }


    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Xóa danh mục thành công.' })
    @ApiOperation({ summary: 'Xóa danh mục' })
    @ApiResponse({
        status: 404,
        schema: {
          example: {
            message: 'Không tìm thấy danh mục cần xóa.',
          },
        },
      })
      @ApiResponse({
        status: 401,
        description: 'Chưa xác thực. Cần phải đăng nhập.',
        schema: {
          example: {
            message: 'Unauthorized',
          },
        },
      })
    async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
    return { message: 'Xóa danh mục thành công' };
    }


    @Get()
    @ApiOperation({ summary: 'Danh sách danh mục' })
    find(){
        return this.categoryService.find();
    }

    @Get('/:categorySlug')
    @ApiOperation({ summary: 'Danh sách bài viết theo danh mục' })
    async blogsByCategory(@Param('categorySlug') categorySlug: string) {
      return await this.categoryService.findBlogsByCategorySlug(categorySlug);
    }
}