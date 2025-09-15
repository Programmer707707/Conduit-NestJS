/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { IUserResponse } from "./types/userResponse.interface";
import { LoginDto } from "./dto/loginUser.dto";
import { compare } from "bcryptjs";
import { IUser } from "./types/user.type";


@Injectable()
export class UserService{
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,

    ){}

    async createUser(createUserDto: CreateUserDto): Promise<IUserResponse>{
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);

        const userByEmail = await this.userRepository.findOne({where: {email: createUserDto.email} });

        const userByUserName = await this.userRepository.findOne({where: {username: createUserDto.username} });

        if(userByEmail || userByUserName){
            throw new HttpException('Email or username is already taken!', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const savedUser = await this.userRepository.save(newUser);
        return this.generateUserResponse(savedUser);
    }


    async loginUser(loginUserDto: LoginDto): Promise<IUser>{
        const user = await this.userRepository.findOne({where: {email: loginUserDto.email}, select: ['id', 'email', 'username','bio', 'image', 'password']})
        if(!user){
            throw new HttpException('Wrong Email', HttpStatus.UNAUTHORIZED);
        }

        const matchPassword = await compare(loginUserDto.password, user.password);

        if(!matchPassword){
            throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
        }

        const {password, ...safeUser} = user;
        return safeUser;
    }

    generateToken(user: IUser): string{
        const generatedToken = this.jwtService.sign({
            id: user.id,
            username: user.username,
            email: user.email
        })

        console.log(process.env.JWT_SECRET);

        return generatedToken
    }



    generateUserResponse(user: IUser): IUserResponse{
        return {
            user: {
                ...user,
                token: this.generateToken(user)
            }
        }
    }
}