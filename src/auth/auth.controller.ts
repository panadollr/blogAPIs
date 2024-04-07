import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterUserDto } from "./dtos/register-user-dto";
import { LoginUserDto } from "./dtos/login-user-dto";
import { User } from "src/user/user.entity";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post("register")
    @ApiOperation({ summary: 'Đăng ký user mới' })
    @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
    @ApiResponse({
        status: 400,
        description: 'Yêu cầu không hợp lệ do thông tin đầu vào không đủ hoặc sai.',
        schema: {
          example: {
            message: 'Email này đã tồn tại.',
          },
        },
      })
    register(@Body() dto: RegisterUserDto): Promise<User> {
        return this.authService.register(dto);
    }

    @Post("login")
    @ApiOperation({ summary: 'Đăng nhập user' })
    @ApiResponse({ status: 201, description: 'Đăng nhập thành công' })
    @ApiResponse({
        status: 400,
        description: 'Yêu cầu không hợp lệ do thông tin đầu vào không đủ hoặc sai.',
        schema: {
          example: {
            message1: 'Email này không tồn tại.',
            message2: 'Sai mật khẩu !.'
          },
        },
      })
    login(@Body() dto: LoginUserDto): Promise<any>{
        return this.authService.login(dto);
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'Làm mới access token' })
    refreshToken(@Body() {refresh_token}):Promise<any>{
        console.log('refresh_token api')
        return this.authService.refreshToken(refresh_token);
    }
}