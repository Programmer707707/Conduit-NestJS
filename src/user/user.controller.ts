import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { IUserResponse } from "./types/userResponse.interface";
import { LoginDto } from "./dto/loginUser.dto";

@Controller()
export class UserController{
    constructor(private readonly userService: UserService){}

    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any>{
        return await this.userService.createUser(createUserDto);
    }

    @Post('users/login')
    async loginUser(@Body('user') loginUserDto: LoginDto): Promise<IUserResponse>{
        const user = await this.userService.loginUser(loginUserDto);
        return this.userService.generateUserResponse(user);
    }

    @Get('user')
    async getCurrentUser(): Promise<IUserResponse>{
        return "get current user" as any;
    }
}