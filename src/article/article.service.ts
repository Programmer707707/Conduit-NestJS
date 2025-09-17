import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "./article.entity";
import { DeleteResult, Repository } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { IArticleResponse } from "./types/articleResponse.interface";
import slugify from "slugify";
import { UpdateArticleDto } from "./dto/updateArticle.dto";

@Injectable()
export class ArticleService{
    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>
    ){}

    async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity>{
        const article = new ArticleEntity();

        Object.assign(article, createArticleDto);

        if(!article.tagList){
            article.tagList = [];
        }

        article.slug = this.generateSlug(article.title);

        return await this.articleRepository.save(article);
    }

    async getSingleArticle(slug: string): Promise<IArticleResponse>{
        const article = await this.articleRepository.findOne({where: {slug}, relations: ['author']});

        if(!article){
            throw new HttpException('Article is not found!', HttpStatus.NOT_FOUND);
        }

        return this.generateArticleResponse(article);
    }

    async deleteSingleArticle(slug: string, userId: number): Promise<DeleteResult>{
        const article = await this.articleRepository.findOne({where: {slug}, relations: ['author']});

        if(!article){
            throw new HttpException('Article is not found!', HttpStatus.NOT_FOUND);
        }

        if(article.authorId !== userId){
            throw new HttpException('You are not the author of this article', HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({ slug });
    }

    async updateArticle(slug: string, userId: number, updatedArticleDto: UpdateArticleDto): Promise<ArticleEntity>{
        const article = await this.articleRepository.findOne({where: {slug}, relations: ['author']});

        if(!article){
            throw new HttpException('Article is not found!', HttpStatus.NOT_FOUND);
        }

        if(article.authorId !== userId){
            throw new HttpException('You are not the author of this article', HttpStatus.FORBIDDEN);
        }

        if(updatedArticleDto.title){
            article.slug = this.generateSlug(article.title);
        }

        Object.assign(article, updatedArticleDto);

        return await this.articleRepository.save(article);
        
    }

    generateSlug(title: string): string{
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        return `${slugify(title, {lower: true})}-${id}`;
    }

    generateArticleResponse(article: ArticleEntity): IArticleResponse{
        return {
            article
        }
    }
}