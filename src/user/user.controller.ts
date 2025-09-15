import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";

@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService){}

    @UsePipes(new ValidationPipe())
    @Post()
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any>{
        return await this.userService.createUser(createUserDto);
    }
}