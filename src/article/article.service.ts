import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "./article.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { CreateArticleDto } from "./createArticle.dto";
import { IArticleResponse } from "./types/articleResponse.interface";
import slugify from "slugify";

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