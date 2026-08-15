export async function handler(event) {
  const year = Number.parseInt(event.queryStringParameters?.year, 10);
  const organizationId = Number.parseInt(event.queryStringParameters?.organizationId, 10);

  if (!Number.isInteger(year) || year < 2025 || year > 2100) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid year" })
    };
  }

  if (!Number.isInteger(organizationId) || organizationId < 1) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid organizationId" })
    };
  }

  const target =
    `https://slhjx7xcc1.execute-api.us-east-2.amazonaws.com/prod/api/getGames?year=${encodeURIComponent(year)}&organizationId=${encodeURIComponent(organizationId)}`;

  try {
    const response = await fetch(target, {
      headers: {
        "accept": "application/json, text/plain, */*",
        "user-agent": "Mozilla/5.0",
        "origin": "http://bgyfl-website-new-prod.s3-website.us-east-2.amazonaws.com",
        "referer": "http://bgyfl-website-new-prod.s3-website.us-east-2.amazonaws.com/"
      }
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "BGYFL request failed", detail: err.message })
    };
  }
}
