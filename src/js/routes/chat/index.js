import Router from 'koa-router';

const router = new Router();

router.get('/chat', async (ctx) => {
  const { chat } = ctx.request.body;
  ctx.response.body = 'hello';
});

export default router;