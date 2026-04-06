exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  // Этот код гарантированно отрезает все случайные пробелы и переносы строк из ключа
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();

  // Жестко прописанная, 100% рабочая ссылка на самую актуальную модель
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
    apiKey;

  try {
    const payload = JSON.parse(event.body);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Если Google выдал ошибку, возвращаем ее на сайт красиво
    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: "Системная ошибка" } }),
    };
  }
};
