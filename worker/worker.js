export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "https://dv1207.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    try {
      const { question } = await request.json();
      if (!question || typeof question !== "string") {
        return new Response(JSON.stringify({ error: "Missing question" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...cors },
        });
      }

      const messages = [
        {
          role: "system",
          content:
            "You are a concise tutor for Spark, Scala, PySpark, SQL, and Python. Answer at the level a 5-year data engineer expects. Keep it under 150 words unless the user asks for more depth.",
        },
        { role: "user", content: question },
      ];

      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", { messages });

      return new Response(JSON.stringify({ answer: result.response }), {
        headers: { "Content-Type": "application/json", ...cors },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
  },
};
