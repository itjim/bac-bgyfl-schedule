export async function handler(event, context) {
  const target = event.queryStringParameters.url;
  if (!target) {
    return {
      statusCode: 400,
      body: "Missing url parameter"
    };
  }

  try {
    const response = await fetch(target);
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error: " + err.message
    };
  }
}
