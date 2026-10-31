/**
 * One-time Sage OAuth 2.0 authorization CLI script.
 *
 * Runs via: npm run sage:auth
 *
 * Steps:
 * 1. Reads client credentials from .env.
 * 2. Starts a temporary local HTTP server on port 3000 to listen for the callback.
 * 3. Prints the authorize URL for the user to visit in their browser.
 * 4. Receives the authorization code, exchanges it at Sage's token endpoint.
 * 5. Fetches available businesses to identify the business ID.
 * 6. Persists tokens to .data/sage_tokens.json (gitignored).
 * 7. Closes cleanly.
 */

import http from "node:http";
import { loadDotEnv } from "./env.mjs";
import { writeSageTokens } from "../src/data/canonical/sage/tokenStore";
import type { SageBusiness, SageListEnvelope, SageTokenResponse } from "../src/data/canonical/sage/raw/types";

loadDotEnv();

const clientId = process.env.SAGE_CLIENT_ID;
const clientSecret = process.env.SAGE_CLIENT_SECRET;
const callbackUrl = process.env.SAGE_CALLBACK_URL || "http://localhost:3000/api/sage/callback";
const baseUrl = (process.env.SAGE_BASE_URL || "https://api.accounting.sage.com/v3.1").replace(/\/+$/, "");
const oauthUrl = (process.env.SAGE_OAUTH_URL || "https://oauth.accounting.sage.com/token").replace(/\/+$/, "");

if (!clientId || !clientSecret) {
  console.error("Error: SAGE_CLIENT_ID and SAGE_CLIENT_SECRET must be set in .env");
  process.exit(1);
}

const parsedCallback = new URL(callbackUrl);
const port = Number(parsedCallback.port) || 3000;
const pathname = parsedCallback.pathname;

const authUrl = new URL("https://www.sageone.com/oauth2/auth/central");
authUrl.searchParams.set("filter", "apiv3.1");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", callbackUrl);
authUrl.searchParams.set("scope", "readonly");
authUrl.searchParams.set("country", "gb");
authUrl.searchParams.set("state", "buki-auth-init");

console.log("\n--- Sage OAuth 2.0 Authorization ---");
console.log("1. Open the following URL in your browser to sign in to your Sage trial:");
console.log(`\n   ${authUrl.toString()}\n`);
console.log(`2. Waiting for callback on ${callbackUrl}...`);

const server = http.createServer(async (req, res) => {
  if (!req.url) return;
  const reqUrl = new URL(req.url, `http://localhost:${port}`);

  if (reqUrl.pathname !== pathname) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  const code = reqUrl.searchParams.get("code");
  const error = reqUrl.searchParams.get("error");
  const errorDesc = reqUrl.searchParams.get("error_description");

  if (error) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`<h1>Authorization Failed</h1><p>${error}: ${errorDesc || "Unknown error"}</p>`);
    console.error(`\nAuthorization failed: ${error} (${errorDesc})`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Missing authorization code");
    return;
  }

  console.log("\nReceived authorization code. Exchanging for tokens...");

  try {
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
    });

    const tokenRes = await fetch(oauthUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      throw new Error(`Token exchange failed (HTTP ${tokenRes.status}): ${errBody}`);
    }

    const tokenData = (await tokenRes.json()) as SageTokenResponse;

    // Fetch businesses using the new access token
    console.log("Fetching Sage businesses...");
    const bizRes = await fetch(`${baseUrl}/businesses`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    let businessId: string | undefined = process.env.SAGE_BUSINESS_ID;
    if (bizRes.ok) {
      const bizBody = await bizRes.json();
      const businesses: SageBusiness[] = Array.isArray(bizBody)
        ? bizBody
        : (bizBody as SageListEnvelope<SageBusiness>).$items || [];

      if (businesses.length > 0) {
        businessId = businesses[0].id;
        console.log(`Discovered Business: "${businesses[0].name}" (ID: ${businessId})`);
      }
    }

    await writeSageTokens({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      businessId,
    });

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<html><body style='font-family:sans-serif;text-align:center;padding:50px;'>" +
        "<h1 style='color:#16a34a;'>Sage Authorization Successful!</h1>" +
        "<p>Your tokens have been saved to <code>.data/sage_tokens.json</code>.</p>" +
        "<p>You can close this tab and return to the terminal.</p>" +
        "</body></html>",
    );

    console.log("\nTokens successfully stored in .data/sage_tokens.json!");
    if (businessId && !process.env.SAGE_BUSINESS_ID) {
      console.log(`Tip: Add SAGE_BUSINESS_ID=${businessId} to your .env`);
    }
    console.log("Next step: Set FINANCE_SOURCE=sage in .env and run npm run sync\n");

    setTimeout(() => {
      server.close();
      process.exit(0);
    }, 1000);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(`Error: ${err instanceof Error ? err.message : String(err)}`);
    console.error("Error exchanging token:", err);
    server.close();
    process.exit(1);
  }
});

server.listen(port, () => {
  console.log(`Local listener running on port ${port}. Awaiting browser redirect...`);
});
