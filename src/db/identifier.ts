import { getManager } from 'typeorm';
import { genRandomString } from '../auth/sha512';

export async function createUniqueIdentifier(number: number): Promise<string> {
    const sql = getManager();

    let done = false;
    let identifier = genRandomString(number);

    while (!done) {
        const sqlResponse = await sql.query(
            'SELECT EXISTS(SELECT * FROM user WHERE identifier=?)',
            [identifier],
        );

        const exist = !!+Object.keys(sqlResponse)[0];

        if (exist) {
            identifier = genRandomString(number);
        } else {
            done = true;
        }
    }

    return identifier;
}
