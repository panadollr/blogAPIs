import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { FilterUserDto } from "./dtos/filter-user-dto";
import { User } from "./user.entity";
import { RegisterUserDto } from "src/auth/dtos/register-user-dto";

@ApiTags('Users')
@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService){}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post("create")
    @ApiOperation({ summary: 'Thêm mới user' })
    @ApiResponse({ status: 201, description: 'User được tạo thành công.' })
    @ApiResponse({
        status: 400,
        description: 'Yêu cầu không hợp lệ do thông tin đầu vào không đủ hoặc sai.',
        schema: {
          example: {
            message: 'Email đã tồn tại.',
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
    create(@Body() dto: RegisterUserDto){
        return this.userService.create(dto);
    }

    
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post("update/:id")
    @ApiOperation({ summary: 'Cập nhật user' })
    @ApiResponse({ status: 201, description: 'User được cập nhật thành công.' })
    @ApiResponse({
        status: 400,
        description: 'Yêu cầu không hợp lệ do thông tin đầu vào không đủ hoặc sai.',
        schema: {
          example: {
            message: 'Email đã tồn tại.',
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
    update(@Param('id') id: number, @Body() dto: RegisterUserDto){
        return this.userService.update(id, dto);
    }


    @Get()
    @ApiOperation({ summary: 'Danh sách user' })
    findAll(@Query() query: FilterUserDto): Promise<User[]>{
        return this.userService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Thông tin chi tiết của user' })
    @ApiResponse({
        status: 404,
        schema: {
          example: {
            message: 'Không tìm thấy user ',
          },
        },
      })
    findDetail(@Param('id') id: number): Promise<User>{
        return this.userService.findDetail(id);
    }


    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Xóa user thành công.' })
    @ApiOperation({ summary: 'Xóa user' })
    @ApiResponse({
        status: 404,
        schema: {
          example: {
            message: 'Không tìm thấy user cần xóa.',
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
    @ApiExcludeEndpoint()
    async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userService.delete(id);
    return { message: 'Xóa user thành công' };
    }
}