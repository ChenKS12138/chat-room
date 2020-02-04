const SOCKET_EVENT = {
  "postMessage":"POST_MESSAGE"
}

class Handler{
  /**
   * @param {SocketIO.Server} io socket.io 服务器实例
   * @param {SocketIO.Socket} socket socket 实例
   * @param {Message} messageHanlder 消息处理实例
   */
  constructor(io, socket, messageHandler) {
    this.io = io;
    this.socket = socket;
    this.username = "";
    this.message = messageHandler;
  }
  emitHistory = () => {
    this.message.emitHistory(this.socket)
  };
  emitMessage = message => {
    this.message.emitToAll(this.username, message);
  }
  // 变更用户名
  changeUsername = username => {
    this.username = username;
    // 并告知所有用户该用户加入聊天室
    this.emitMessage("🔵 <strong>" + this.username + "</strong> 加入聊天室");
  };

  // 发送消息
  postMessage = message => {
    this.emitMessage("<strong>" + this.username + "</strong>: " + message);
  };

  // 断开连接
  disconnect = () => {
    this.emitMessage("🔴 <i>" + this.username + " 离开了聊天室..</i>");
  };

  // 欢迎消息
  welcome = () =>
    this.message.emit(
      this.socket,
      `WELCOME! 输入 <strong>/help</strong> 查看帮助`
    );

  // 帮助消息
  help = () =>
    this.message.emit(
      this.socket,
      `
<div>
  <p><strong>咩都无</strong></p>
</div>
`
    );
}

class Message{
  constructor(io) {
    this.messages = [];
    this.io = io;
  }
  save = (username,message) => {
    const messageEntry = {
      key: `${Date.now()}-${username}`,
      timestamp: Date.now(),
      username,
      message
    };
    this.messages.push(messageEntry);
    return messageEntry;
  }

  emitToAll = (username,message) => {
    const messageEntry = this.save(username, message);
    this.io.emit(SOCKET_EVENT.postMessage, messageEntry);
  }


  /**
   * 向特定 socket 发送单条消息
   * @param {SocketIO.Socket} socket
   * @param {object} message
   */
  emit = (socket, message) => {
    socket.emit(SOCKET_EVENT.postMessage, message);
  };

  emitHistory = socket => {
    this.messages.forEach(message => {
      this.emit(socket, message);
    })
  }
}
module.exports = {Handler,Message}