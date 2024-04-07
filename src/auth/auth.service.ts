import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./dtos/register-user-dto";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginUserDto } from "./dtos/login-user-dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService{
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService:ConfigService
    ){}

    async register(dto: RegisterUserDto) {
        const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        const user = this.userRepository.create(dto);
        
        return await this.userRepository.save(user);
    }
    
    async login(dto: LoginUserDto): Promise<any> {
        const { email, password } = dto;
        const user = await this.userRepository.findOne({ where: { email } });
    
        if (!user) {
            throw new HttpException("Email này không tồn tại !", HttpStatus.UNAUTHORIZED);
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
            throw new HttpException("Sai mật khẩu !", HttpStatus.UNAUTHORIZED);
        }
        //generate access token and request token
        const payload = {id: user.id, email: user.email};
        return this.generateToken(payload);

    }

    private async generateToken(payload: {id: number, email: string}){
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
        })
        await this.userRepository.update(
            {email: payload.email},
            {refresh_token: refresh_token}
        )

        return {access_token, refresh_token};
    }

    async refreshToken(refresh_token: string):Promise<any>{
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token,{
                secret: '123456'
            });
            const checkExistToken = await this.userRepository.findOneBy({ email: verify.email, refresh_token})
            if(checkExistToken){
                return this.generateToken({id : verify.id, email: verify.email})
            } else {
                throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
            }
        } catch (error) {
            throw new HttpException('Refresh token is not valid !', HttpStatus.BAD_REQUEST)
        }
    }
    
        findMany(){
            return this.userRepository.find({where: { id: 100 }});
        }
}