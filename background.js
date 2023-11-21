var photos = []

isStart = false

// 监听消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // 如果收到获取全局变量的请求，返回全局变量的值
    if (request.action === "getIsStart") {
      sendResponse({ value: isStart })
    }
    if (request.action === "setIsStart") {
        isStart = request.value
        console.log('收到消息: ', isStart)
        sendResponse({})
    }
  });