import combineRouters from 'koa-combine-routers';
import index from './index/index.js';
import authorization from './authorization/index.js';

const router = combineRouters(
  index,
  authorization,
);

export default router;