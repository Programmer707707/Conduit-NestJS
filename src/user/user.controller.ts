import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { IUserResponse } from "./types/userResponse.interface";
import { LoginDto } from "./dto/loginUser.dto";
import type { AuthRequest } from "types/expressRequest.interface";

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
    async getCurrentUser(@Req() request: AuthRequest): Promise<IUserResponse>{
        // console.log(request.user);
        return this.userService.generateUserResponse(request.user)
    }
}