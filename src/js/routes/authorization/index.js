import Router from 'koa-router';
import { v4 as uuidv4 } from 'uuid';

const router = new Router();
const nicknames = new Map();

router.post('/authorization', async (ctx) => {
  const { nickname } = ctx.request.body;
  if (nicknames.has(nickname)) {
    ctx.response.body = {auth: false}; 
  } else {
    const id = uuidv4();
    nicknames.set(nickname, id);
    ctx.response.body = {auth: id};
  }
});

export default router;
export { nicknames };