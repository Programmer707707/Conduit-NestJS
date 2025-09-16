import { Body, Controller, Get, Post, Put,Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { IUserResponse } from "./types/userResponse.interface";
import { LoginDto } from "./dto/loginUser.dto";
import { User } from "./decorators/user.decorator";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUserDto";

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

    @Put('user')
    @UseGuards(AuthGuard)
    async updateUser(@User('id') userId: number, @Body('user') updateUserDto: UpdateUserDto): Promise<IUserResponse>{
        const updatedUser = await this.userService.updateUser(userId, updateUserDto);
        return this.userService.generateUserResponse(updatedUser);   
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async getCurrentUser(@User() user): Promise<IUserResponse>{
        console.log(user);
        return this.userService.generateUserResponse(user)
    }
}