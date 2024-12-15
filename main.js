async function recognize(base64, lang, options) {
    const { config } = options;
    // const { tauriFetch: fetch } = utils;
    let { model = "Pro/Qwen/Qwen2-VL-7B-Instruct", apiKey, requestPath, customPrompt } = config;

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

    if (!customPrompt) {
        customPrompt = "Just recognize the text in the image. Do not offer unnecessary explanations.";
    }else{
        customPrompt = customPrompt.replaceAll("$lang", lang);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }

    const body = {
        model,
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": customPrompt
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": `data:image/jpeg;base64,${base64}`,
                        },
                    },
                ],
            }
        ],
    }
    let res = await window.fetch(apiUrl.href, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });

    if (res.ok) {
        let result = await res.json();
        const { choices } = result;
        if (choices) {
            let target = choices[0].message.content.trim();
            if (target) {
                if (target.startsWith('"')) {
                    target = target.slice(1);
                }
                if (target.endsWith('"')) {
                    target = target.slice(0, -1);
                }
                return target.trim();
            } else {
                throw JSON.stringify(choices);
            }
        } else {
            throw JSON.stringify(result);
        }
    } else {
        const errorData = await res.json().catch(() => null);
        throw `Http Request Error\nHttp Status: ${res.status}\n${errorData ? JSON.stringify(errorData) : 'No error details available'}`;
    }
}
