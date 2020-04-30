import _ from 'lodash';
import { getManager } from 'typeorm';

export async function truncateTables(tablesArray: string[]) {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error(
            "Truncate is supposed to be called only in 'test' environment!",
        );
    }

    const sql = getManager();
    try {
        await sql.query(`TRUNCATE TABLE ${tablesArray[0]}`);
    } catch (err) {
        console.error(err);
    }
}
