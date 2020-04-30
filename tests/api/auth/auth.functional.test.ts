import { expect } from 'chai';
import 'mocha';
import axios from 'axios';

describe('src/controllers/user.ts auth', () => {
    describe('POST authenticateUser', async () => {
        it('no user found', async () => {
            const email = 'test@gmail.com';
            const password = 'whatever';

            try {
                await axios.post('http://localhost:8081/auth', {
                    email,
                    password,
                });
            } catch (err) {
                expect(err.response.status).to.equal(400);
                expect(err.response.data.message).to.equal(
                    `No user has been found for '${email}'.`,
                );
            }
        });

        it('wrong password', async () => {});

        it('successful sign in', async () => {});
    });
});
