import { User } from '../models/User';
import { Context, ParameterizedContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { request, summary, responsesAll, tagsAll } from 'koa-swagger-decorator';
import jwt from 'jsonwebtoken';

import { saltHashPassword, genRandomString } from '../auth/sha512';
import { createUniqueIdentifier } from '../db/identifier';
import ValidateEmail from '../helpers/validateEmail';
import ValidatePassword from '../helpers/validatePassword';

@responsesAll({
    200: { description: 'success' },
    400: { description: 'bad request' },
    401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['User'])
export default class UserController {
    @request('get', '/user')
    @summary('Find all users')
    public static async getUsers(ctx: Context) {
        // get an user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(
            User,
        );

        // load all users
        const users: User[] = await userRepository.find();

        // return OK status code and loaded items array
        ctx.status = 200;
        ctx.body = users;
    }

    @request('get', '/user/:identifier')
    @summary('Find user by identifier')
    public static async findUserbyIdentifier(identifier: string) {
        const userRepository: Repository<User> = getManager().getRepository(
            User,
        );

        // load user with specific identifier
        const user: User | undefined = await userRepository.findOne({
            identifier,
        });

        return user;
    }

    public static async createAccount(ctx: Context) {
        // get an user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(
            User,
        );

        const {
            username,
            password,
            email,
        }: {
            username: string;
            email: string;
            password: string;
        } = ctx.request.body;

        if (ValidateEmail(email)) {
            if (username.trim().length !== 0) {
                if (ValidatePassword(password)) {
                    const passwordData = saltHashPassword(password);

                    const u = new User();
                    u.email = email;
                    u.username = username;
                    u.password_salt = passwordData.salt;
                    u.password_hash = passwordData.hash;
                    u.identifier = await createUniqueIdentifier(16);
                    u.level = 0;
                    u.confirm_key = genRandomString(16);
                    u.confirm_requested = new Date();

                    try {
                        await userRepository.save(u);

                        const token = jwt.sign(
                            { identifier: u.identifier },
                            process.env.JWT_SECRET || 'secret',
                            {
                                expiresIn: 86400, // expires in 24 hours
                            },
                        );

                        ctx.status = 200;
                        ctx.body = { auth: true, token };
                    } catch (err) {
                        const { errno, code, message } = err;

                        if (code === 'ER_DUP_ENTRY') {
                            ctx.status = 200;
                            ctx.body = {
                                message: `'${email}' email is already in use.`,
                            };
                        } else {
                            ctx.status = 400;
                            ctx.body = {
                                code,
                                message,
                                errno,
                            };
                        }
                    }
                } else {
                    ctx.status = 400;
                    ctx.body = {
                        message: `Not valid password. Should contain at least one number, one uppercase and one lowercase letter.`,
                    };
                }
            } else {
                ctx.status = 400;
                ctx.body = {
                    message: `Not valid username`,
                };
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                message: `Not valid email`,
            };
        }
    }
}
