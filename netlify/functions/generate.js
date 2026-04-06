exports.handler = async function(event, context) {
  // Разрешаем только POST-запросы
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Берем спрятанный ключ из настроек Netlify
  const apiKey = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  try {
    // Получаем данные, которые прислал ваш сайт
    const payload = JSON.parse(event.body);

    // Отправляем запрос в Google Gemini
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Возвращаем ответ обратно на ваш сайт
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Ошибка сервера" }) };
  }
};