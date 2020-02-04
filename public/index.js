const socket = io.connect("/");

const CHANGE_USERNAME = "CHANGE_USERNAME";
const POST_MESSAGE = "POST_MESSAGE";
const REQUEST_HELPING = "REQUEST_HELPING";

const messageEl = $("#message"); // 消息输入框
let username = "";

// 初始化用户名
const initUsername = () => {
  // ask username
  const input = prompt("Please tell me your name");
  username = input;
  socket.emit(CHANGE_USERNAME, input); // 通过 socket 告诉服务器用户名
};

// 监听消息
const listenMessage = () => {
  // append the chat text message
  socket.on(POST_MESSAGE, message => {
    $("#messages").append(
      $("<li>").html(
        // 格式化消息
        typeof message === "object"
          ? `${moment(message.timestamp).format("H:mm:ss")} - ${
              message.message
            }`
          : message
      )
    );
  });
};

const handleClickOnSendButton = e => {
  e.preventDefault();

  if (messageEl.val().startsWith("/")) {
    // 以 "/" 开头的约定为命令
    return handleCommand(messageEl.val());
  }
  if (messageEl.val()) {
    sendMessage(); // 发送消息
  }

  return false;
};


const sendMessage = () => {
  socket.emit(POST_MESSAGE, messageEl.val()); // 通过 socket 向服务器发送消息
  $("#message").val("");
};

// 处理 command
const handleCommand = message => {
  const command = message.split(" ")[0];
  switch (command) {
    case "/help":
      socket.emit(REQUEST_HELPING);
      break;
    default:
      break;
  }

  $("#message").val("");
};

// 初始化一些工作
initUsername();
listenMessage();
$("form").submit(handleClickOnSendButton);