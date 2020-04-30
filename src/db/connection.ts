import { config } from '../config';
import { createConnection } from 'typeorm';

// Product DataBase Connection - pdb
export async function connection() {
    return await createConnection({
        type: 'mysql',
        host: config.db.host,
        port: config.db.port,
        username: config.db.username,
        password: config.db.password,
        database: config.db.endpoint,
        synchronize: true,
        logging: false,
        entities: config.dbEntitiesPath,
        extra: {
            ssl: config.dbsslconn, // if not development, will use SSL
        },
    });
}
