import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import { TagEntity } from "./tag/tag.entity";
import { UserEntity } from "./user/user.entity";
import { DataSource } from "typeorm";


const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'toxirovsherzod',
    password: 'sherzod2005',
    database: 'nestjsblog',
    entities: [TagEntity, UserEntity],
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/migrations/**/*.ts']
}

const AppDataSource = new DataSource(config);

export {AppDataSource}

export default config;