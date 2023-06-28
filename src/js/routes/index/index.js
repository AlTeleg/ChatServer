import Router from 'koa-router';

const router = new Router();

router.get('/index', async (ctx) => {
  ctx.response.body = 'ok';
});

export default router;