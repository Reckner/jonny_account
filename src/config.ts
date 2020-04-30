import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface IConfig {
    port: number;
    db: IConfigDB;
    debugLogging: boolean;
    dbsslconn: boolean;
    jwtSecret: string;
    dbEntitiesPath: string[];
    cronJobExpression: string;
}

interface IConfigDB {
    port: number;
    host: string;
    username: string;
    password: string;
    endpoint: string;
}

const isDevMode = process.env.NODE_ENV == 'development';

let entities;
switch (process.env.NODE_ENV) {
    case 'development':
        entities = ['src/models/**/*.ts'];
    case 'test':
        entities = ['src/models/**/*.ts'];
    case 'production':
        entities = ['dist/models/**/*.js'];
    default:
        entities = ['src/models/**/*.ts'];
}

const config: IConfig = {
    port: +(process.env.PORT || 5000),
    db: {
        port: +(process.env.DATABASE_PORT || 3306),
        host: process.env.DATABASE_HOST || 'host.docker.internal',
        username: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASS || 'root',
        endpoint: process.env.DATABASE_DB || 'db',
    },
    debugLogging: isDevMode,
    dbsslconn: !isDevMode,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-whatever',
    dbEntitiesPath: [...entities],
    cronJobExpression: '0 * * * *',
};

export { config };
