import Router from 'koa-router';
import controllers = require('../controllers');

const publicRouter = new Router();

publicRouter.get('/users', controllers.user.getUsers);
publicRouter.post('/user', controllers.user.createAccount);

publicRouter.post('/auth', controllers.auth.authenticateUser);

export { publicRouter };
