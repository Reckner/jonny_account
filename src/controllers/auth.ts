import { User } from '../models/User';
import { request, summary, responsesAll, tagsAll } from 'koa-swagger-decorator';
import { Context, ParameterizedContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import jwt from 'jsonwebtoken';

import { sha512 } from '../auth/sha512';

@responsesAll({
    200: { description: 'success' },
    400: { description: 'bad request' },
    401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['Auth'])
export default class AuthController {
    @request('post', '/auth')
    public static async authenticateUser(ctx: Context) {
        // get an user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(
            User,
        );

        const {
            email,
            password,
        }: { email: string; password: string } = ctx.request.body;

        const user = await userRepository.findOne({ email });
        if (user) {
            const passwordData = sha512(password, user.password_salt);

            if (passwordData.hash === user.password_hash) {
                const token = jwt.sign(
                    { identifier: user.identifier },
                    process.env.JWT_SECRET || 'secret',
                    {
                        expiresIn: 86400, // expires in 24 hours
                    },
                );

                ctx.status = 200;
                ctx.body = {
                    auth: true,
                    token,
                };
            } else {
                ctx.status = 401;
                ctx.body = {
                    message: `Password does not match for '${email}'.`,
                };
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                message: `No user has been found for '${email}'.`,
            };
        }
    }
}
