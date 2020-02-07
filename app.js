const express = require('express');
const app = express();
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer);
const axios = require("axios").default;

const {Handler ,Message } = require('./handler/socket');

const PORT = 3000;
const DISCONNECT = "disconnect"; // 聊天室断开连接
const CHANGE_USERNAME = "CHANGE_USERNAME"; // 变更用户名
const POST_MESSAGE = "POST_MESSAGE"; // 发送消息
const REQUEST_HELPING = "REQUEST_HELPING"; // 请求帮助信息

app.use(express.static("public"));

app.get('/', (req, res) => res.render('index.ejs'));

app.get('/translate',async (req, res) => {
  const { doctype = 'json', type = 'AUTO', i = 'test' } = req.query;
  const BASE_URL = 'http://fanyi.youdao.com/translate';
  try {
    const { data } = await axios.get(`${BASE_URL}?doctype=${doctype}&type=${type}&i=${i}`);
    res.json(data);
  }
  catch (e) {
    res.json({
      errorCode: -12345
    });
  }
})


// 多 socket 共用一个 messageHandler 来处理、共享消息
const messageHandler = new Message(io);

// 当 socket 连接上时，做以下操作
io.sockets.on("connection", socket => {
  // 实例化一个 Handler 来处理相应请求
  const handler = new Handler(io, socket, messageHandler);
  // 发送欢迎消息
  handler.welcome();
  // 发送历史消息
  handler.emitHistory();

  // 监听对应事件，并做相应操作
  // 变更用户名
  socket.on(CHANGE_USERNAME, handler.changeUsername);
  // 发送消息
  socket.on(POST_MESSAGE, handler.postMessage);
  // 帮助
  socket.on(REQUEST_HELPING, handler.help);
  // 断开连接
  socket.on(DISCONNECT, handler.disconnect);
});

// 启动服务器，并监听 `PORT` 端口
httpServer.listen(PORT, () =>
  console.log(`listening on http://localhost:${PORT}`)
);