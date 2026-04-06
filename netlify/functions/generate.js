exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Если ключ забыли добавить в Netlify
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: { message: "API ключ не найден в настройках Netlify" },
      }),
    };
  }

  // ВАЖНО: Используем стабильную версию модели gemini-1.5-flash

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    const payload = JSON.parse(event.body);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Если Google вернул ошибку (например, неверный ключ), мы передаем ее на сайт
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: "Внутренняя ошибка сервера" } }),
    };
  }
};
