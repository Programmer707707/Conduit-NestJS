import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/user.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleService } from "./article.service";
import { ArticleEntity } from "./article.entity";
import { AuthGuard } from "src/user/guards/auth.guard";
import { IArticleResponse } from "./types/articleResponse.interface";
import { DeleteResult } from "typeorm";
import { UpdateArticleDto } from "./dto/updateArticle.dto";
import { IArticlesResponse } from "./types/articlesResponse.interface";

@Controller('articles')
export class ArticleController{
    constructor(private readonly articleService: ArticleService){}

    @Post()
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard)
    async createArticle(@User() user: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<IArticleResponse>{
        const newArticle = await this.articleService.createArticle(user, createArticleDto);
        return this.articleService.generateArticleResponse(newArticle);
    }

    @Get(':slug')
    async getArticleBySlug(@Param('slug') slug: string): Promise<IArticleResponse>{
        return this.articleService.getSingleArticle(slug);
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    async updateArticle(@Param('slug') slug: string, @User('id') userId: number, @Body('article') updatedArticleDto: UpdateArticleDto): Promise<IArticleResponse>{
        const updatedArticle = await this.articleService.updateArticle(slug, userId, updatedArticleDto);

        return this.articleService.generateArticleResponse(updatedArticle);

    }

    @Get()
    async findAll(@Query() query: any): Promise<IArticlesResponse>{
        return await this.articleService.findAll(query);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticleBySlug(@Param('slug') slug: string, @User('id') userId: number): Promise<DeleteResult>{
        return this.articleService.deleteSingleArticle(slug, userId);
    }
}