import http from 'http';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';
import { WebSocketServer } from 'ws';
import router from './routes/index.js';
import { chat, users } from '../db/db.js';

const app = new Koa();

app.use(cors());

app.use(koaBody({
    urlencoded: true,
    json: true,
}));

app.use(router());

const port = 7070;
const server = http.createServer(app.callback());

const wsServer = new WebSocketServer({
  server
});

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    message = JSON.parse(message.toString());
    if (message.newUser) {
      users.push(message.newUser);
      const eventData = JSON.stringify({ allUsers: users });
      Array.from(wsServer.clients)
        .filter(client => client.readyState === ws.OPEN)
        .forEach(client => client.send(eventData));
      ws.id = message.newUser.id;
      return
    } else if (message.delUser) {
      let index = users.indexOf(message.delUser);
      users.splice(index, 1);
      const eventData = JSON.stringify({ allUsers: users });

      Array.from(wsServer.clients)
        .filter(client => client.readyState === ws.OPEN)
        .forEach(client => client.send(eventData));
      return
    }
    chat.push(message);
    const eventData = JSON.stringify({ chat: [message] });

    Array.from(wsServer.clients)
      .filter(client => client.readyState === ws.OPEN)
      .forEach(client => client.send(eventData));
  });

  ws.on('close', () => {
    let index = users.findIndex(user => user.id === ws.id);
    users.splice(index, 1);
    const eventData = JSON.stringify({ allUsers: users });
    Array.from(wsServer.clients)
    .filter(client => client.readyState === ws.OPEN)
    .forEach(client => client.send(eventData));
  })
  ws.send(JSON.stringify({ chat }));
    
});

server.listen(port);


