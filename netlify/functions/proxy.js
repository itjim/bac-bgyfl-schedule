export async function handler(event, context) {
  const target = event.queryStringParameters.url;
  if (!target) {
    return {
      statusCode: 400,
      body: "Missing url parameter"
    };
  }

  try {
    const response = await fetch(target, {
      headers: {
        "accept": "application/json, text/plain, */*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        "origin": "http://bgyfl-website-new-prod.s3-website.us-east-2.amazonaws.com",
        "referer": "http://bgyfl-website-new-prod.s3-website.us-east-2.amazonaws.com/"
      }
    });

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
