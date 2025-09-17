import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/user.entity";
import { CreateArticleDto } from "./createArticle.dto";
import { ArticleService } from "./article.service";
import { ArticleEntity } from "./article.entity";
import { AuthGuard } from "src/user/guards/auth.guard";
import { IArticleResponse } from "./types/articleResponse.interface";

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
    @UseGuards(AuthGuard)
    async getArticleBySlug(@Param('slug') slug: string): Promise<IArticleResponse>{
        return this.articleService.getSingleArticle(slug);
    }
}