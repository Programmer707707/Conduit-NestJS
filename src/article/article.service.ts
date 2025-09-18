import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "./article.entity";
import { DeleteResult, Repository } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { IArticleResponse } from "./types/articleResponse.interface";
import slugify from "slugify";
import { UpdateArticleDto } from "./dto/updateArticle.dto";
import { IArticlesResponse } from "./types/articlesResponse.interface";

@Injectable()
export class ArticleService{
    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ){}

    async findAll(query: any): Promise<IArticlesResponse>{
        const queryBuilder = this.articleRepository.createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author')

        if(query.tag){
            queryBuilder.andWhere('articles.tagList LIKE :tag', {
                tag: `%${query.tag}`
            })
        }

        if(query.author){
            const author = await this.userRepository.findOne({where: {username: query.author}})

            if(author){
                queryBuilder.andWhere('articles.authorId= :id', {id: author?.id})
            }
            else{
                return {articles: [], articlesCount: 0}
            }
        }

        const articlesCount = await queryBuilder.getCount();


        queryBuilder.orderBy('articles.createdAt', 'DESC')

        if(query.limit){
            queryBuilder.limit(query.limit);
        }

        if(query.offset){
            queryBuilder.offset(query.offset);
        }

        const articles = await queryBuilder.getMany();

        return {articles, articlesCount}
    }

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