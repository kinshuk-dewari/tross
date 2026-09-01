import type { VoyagerResponse } from "./types";

const BASE = "https://www.linkedin.com";

const DECORATION =
  "com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-101";

export class LinkedInUpstreamError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "LinkedInUpstreamError";
  }
}

export interface LinkedInCredentials {
  liAt: string;
  jsessionId: string;
}

function headers(credentials: LinkedInCredentials): HeadersInit {
  return {
    accept: "application/vnd.linkedin.normalized+json+2.1",

    "csrf-token": credentials.jsessionId,

    "x-restli-protocol-version": "2.0.0",

    "x-li-lang": process.env.LINKEDIN_LANGUAGE ?? "en_US",

    "user-agent":
      process.env.LINKEDIN_USER_AGENT ??
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",

    cookie: `li_at=${credentials.liAt}; JSESSIONID=${credentials.jsessionId}`,
  };
}

async function get<T extends VoyagerResponse>(
  path: string,
  credentials: LinkedInCredentials,
): Promise<T> {
  const controller = new AbortController();

  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: headers(credentials),
      cache: "no-store",
      signal: controller.signal,
    });

    const bodyText = await res.text();

    let body: any = null;

    try {
      body = bodyText ? JSON.parse(bodyText) : null;
    } catch {
      body = { raw: bodyText };
    }

    if (!res.ok) {
      throw new LinkedInUpstreamError(
        `LinkedIn returned HTTP ${res.status}`,
        res.status,
      );
    }

    return body as T;
  } catch (e) {
    if (e instanceof LinkedInUpstreamError) {
      throw e;
    }

    if (e instanceof Error && e.name === "AbortError") {
      throw new LinkedInUpstreamError(
        "LinkedIn request timed out",
        504,
      );
    }

    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export class LinkedInClient {
  constructor(private credentials: LinkedInCredentials) {}

  getMe() {
    return get("/voyager/api/me", this.credentials);
  }

  getProfile(publicIdentifier: string) {
    const q = new URLSearchParams({
      q: "memberIdentity",
      memberIdentity: publicIdentifier,
      decorationId: DECORATION,
    });

    return get(
      `/voyager/api/identity/dash/profiles?${q.toString()}`,
      this.credentials,
    );
  }
}