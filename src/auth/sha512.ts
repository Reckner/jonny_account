import crypto from 'crypto';

export const genRandomString = function(length: number): string {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length); /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
export const sha512 = function(password: string, salt: string): PasswordData {
    const hash = crypto.createHmac(
        'sha512',
        salt,
    ); /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        hash: value,
    };
};

export function saltHashPassword(userpassword: string): PasswordData {
    const salt = genRandomString(16); /** Gives us salt of length 16 */
    const passwordData = sha512(userpassword, salt);

    return passwordData;
}

interface PasswordData {
    salt: string;
    hash: string;
}
