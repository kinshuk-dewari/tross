import { NextRequest, NextResponse } from "next/server";

import { profileRequestSchema } from "@/lib/linkedin/validation";
import { extractPublicIdentifier } from "@/lib/linkedin/profile-url";
import {
  LinkedInClient,
  LinkedInUpstreamError,
} from "@/lib/linkedin/client";
import { parseProfile } from "@/lib/linkedin/parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    /* Read LinkedIn credentials from headers */

    const liAt = req.headers.get("li_at");
    const jsessionId = req.headers.get("JSESSIONID");

    if (!liAt || !jsessionId) {
      return NextResponse.json(
        {
          error: {
            code: "MISSING_LINKEDIN_CREDENTIALS",
            message: "li_at and JSESSIONID headers are required",
          },
        },
        { status: 401 },
      );
    }

    /* Validate request body */

    const body = await req.json();

    const result = profileRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            details: result.error.flatten(),
          },
        },
        { status: 400 },
      );
    }

    /*Extract LinkedIn public identifier */

    const publicIdentifier = extractPublicIdentifier(
      result.data.url,
    );

    /* Create LinkedIn client using credentials supplied by this request */

    const client = new LinkedInClient({
      liAt,
      jsessionId,
    });

    /* Call LinkedIn */

    const raw = await client.getProfile(publicIdentifier);

    /*Parse LinkedIn response*/

    const profile = parseProfile(raw);

    /* Return result */

    return NextResponse.json({
      profile: {
        ...profile,
        url: result.data.url,
      },
      meta: {
        source: "linkedin-voyager",
        publicIdentifier,
      },
    });
  } catch (e) {

    /* LinkedIn upstream errors */

    if (e instanceof LinkedInUpstreamError) {
      const status = e.status === 404 ? 404 : e.status === 429 ? 429 : e.status === 403 || e.status === 401
              ? 502 : e.status >= 500 ? 502 : 500;

      return NextResponse.json(
        {
          error: {
            code: "LINKEDIN_UPSTREAM_ERROR",
            message: e.message,
          },
        },
        { status },
      );
    }

    /* Unexpected errors */
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message:
            e instanceof Error
              ? e.message
              : "Unexpected server error",
        },
      },
      { status: 500 },
    );
  }
}