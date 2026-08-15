export async function handler(event) {
  const params = event.queryStringParameters || {};

  const year = Number.parseInt(params.year, 10);
  if (!Number.isInteger(year) || year < 2020 || year > 2100) {
    return jsonResponse(400, { error: "Invalid year" });
  }

  const target = new URL(
    "https://slhjx7xcc1.execute-api.us-east-2.amazonaws.com/prod/api/getGames"
  );

  target.searchParams.set("year", String(year));

  let hasScope = false;

  if (params.organizationId !== undefined) {
    const organizationId = Number.parseInt(params.organizationId, 10);
    if (!Number.isInteger(organizationId) || organizationId < 1 || organizationId > 100000) {
      return jsonResponse(400, { error: "Invalid organizationId" });
    }
    target.searchParams.set("organizationId", String(organizationId));
    hasScope = true;
  }

  if (params.week !== undefined) {
    const week = Number.parseInt(params.week, 10);
    if (!Number.isInteger(week) || week < 1 || week > 30) {
      return jsonResponse(400, { error: "Invalid week" });
    }
    target.searchParams.set("week", String(week));
    hasScope = true;
  }

  if (params.teamId !== undefined) {
    const teamId = Number.parseInt(params.teamId, 10);
    if (!Number.isInteger(teamId) || teamId < 1 || teamId > 10000000) {
      return jsonResponse(400, { error: "Invalid teamId" });
    }
    target.searchParams.set("teamId", String(teamId));
    hasScope = true;
  }

  if (params.divisionId !== undefined) {
    const divisionId = String(params.divisionId).trim();
    if (!/^[A-Za-z0-9_-]{1,80}$/.test(divisionId)) {
      return jsonResponse(400, { error: "Invalid divisionId" });
    }
    target.searchParams.set("divisionId", divisionId);
    hasScope = true;
  }

  if (!hasScope) {
    return jsonResponse(400, {
      error: "At least one of organizationId, week, teamId, or divisionId is required"
    });
  }

  try {
    const response = await fetch(target.toString(), {
      headers: {
        "accept": "application/json, text/plain, */*",
        "user-agent": "Mozilla/5.0",
        "origin": "http://bgyfl-website-new-prod.s3-website.us-east-2.amazonaws.com",
        "referer": "http://bgyfl-website-new-prod.s3-website.us-east-2.amazonaws.com/"
      }
    });

    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      },
      body
    };
  } catch (err) {
    return jsonResponse(502, {
      error: "BGYFL request failed",
      detail: err.message
    });
  }
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(payload)
  };
}
