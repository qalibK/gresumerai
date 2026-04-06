exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: { message: "Ключ API не найден в Netlify." },
      }),
    };
  }

  // Строго заданная модель без лишних символов
  const modelName = "gemini-1.5-flash";
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    modelName +
    ":generateContent?key=" +
    apiKey;

  try {
    const payload = JSON.parse(event.body);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: { message: "Ошибка сервера: " + error.message },
      }),
    };
  }
};
