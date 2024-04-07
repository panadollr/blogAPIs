import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dtos/create-blog-dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";
import { FilterBlogDto } from "./dtos/filter-blog-dto";
import { Blog } from "./blog.entity";


@ApiTags('Blogs')
@Controller('blogs')
export class BlogController{
    constructor(private readonly blogService: BlogService){}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post("create")
    @ApiOperation({ summary: 'Tạo một bài viết mới' })
    @ApiResponse({ status: 201, description: 'Bài viết được tạo thành công.' })
    @ApiResponse({
        status: 400,
        description: 'Yêu cầu không hợp lệ do thông tin đầu vào không đủ hoặc sai.',
        schema: {
          example: {
            message: 'Slug của bài viết này đã tồn tại hoặc Tiêu đề của bài viết này đã tồn tại.',
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
    create(@Req() req:Request, @Body() dto: CreateBlogDto){
        const categoryId = dto.category; // Lấy categoryId từ DTO
        return this.blogService.create(dto, req['user_data'].id, categoryId);
    }

    
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post("update/:id")
    @ApiResponse({ status: 201, description: 'Bài viết được cập nhật thành công.' })
    @ApiOperation({ summary: 'Cập nhật bài viết' })
    @ApiResponse({
        status: 400,
        description: 'Yêu cầu không hợp lệ do thông tin đầu vào không đủ hoặc sai.',
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
    update(@Param('id') id: number, @Body() dto: CreateBlogDto, @Req() req:Request,){
      const categoryId = dto.category; // Lấy categoryId từ DTO
        return this.blogService.update(id, dto, req['user_data'].id, categoryId);
    }
    
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Xóa bài viết thành công.' })
    @ApiOperation({ summary: 'Xóa bài viết' })
    @ApiResponse({
        status: 404,
        schema: {
          example: {
            message: 'Không tìm thấy bài viết cần xóa.',
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
    await this.blogService.delete(id);
    return { message: 'Xóa blog thành công' };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Chi tiết bài viết' })
    @ApiResponse({
        status: 404,
        schema: {
          example: {
            message: 'Không tìm thấy bài viết ',
          },
        },
      })
    findDetail(@Param('id') id: number): Promise<Blog>{
        return this.blogService.findDetail(id);
    }

    @Get()
    @ApiOperation({ summary: 'Danh sách bài viết' })
    findAll(@Query() query: FilterBlogDto): Promise<Blog[]>{
        return this.blogService.findAll(query);
    }
}