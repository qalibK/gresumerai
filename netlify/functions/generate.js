exports.handler = async function (event) {
  console.log("Netlify function generate invoked", {
    method: event.httpMethod,
    path: event.path || event.rawUrl || "/api/generate",
    bodyLength: event.body?.length || 0,
    hasApiKey: !!process.env.GOOGLE_API_KEY,
  });

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    console.error("Invalid JSON body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body." }),
    };
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GOOGLE_API_KEY environment variable.");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing GOOGLE_API_KEY environment variable.",
      }),
    };
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      statusCode: response.ok ? 200 : response.status,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Generate function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Unknown error",
        type: error.name,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
