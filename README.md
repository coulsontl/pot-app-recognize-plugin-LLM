# Pot-App LLM 文字识别插件
## 说明
支持通过OneApi中转后使用Gemini2，fork from [OpenAI](https://github.com/Ideenaster/pot-app-recognize-plugin-LLM)
## usage
填入API和API Endpoint，Endpoint的逻辑为：
```js
if (!requestPath) {
    requestPath = "https://api.siliconflow.cn";
}

if (!/https?:\/\/.+/.test(requestPath)) {
    requestPath = `https://${requestPath}`;
}
const apiUrl = new URL(requestPath);

// in openai like api, /v1 is not required
if (!apiUrl.pathname.endsWith('/chat/completions')) {
    // not openai like, populate completion endpoint
    apiUrl.pathname += apiUrl.pathname.endsWith('/') ? '' : '/';
    apiUrl.pathname += 'v1/chat/completions';
}
```
可以自行理解，请求的模板当然是OpenAI兼容格式。
## input为自填
提供一些参考：
- `Pro/Qwen/Qwen2-VL-7B-Instruct`
  建议走硅基流动，￥0.35/1M tokens，而且这家有活动，邀请注册直接送￥14，浅浅贴个[#aff](https://cloud.siliconflow.cn/i/9ADlLqtT)。