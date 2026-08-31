import { z } from "zod";
export const profileRequestSchema = z.object({
  url: z
    .string()
    .url()
    .refine((value) => {
      const host = new URL(value).hostname.toLowerCase();
      return host === "linkedin.com" || host === "www.linkedin.com";
    }, "URL must be a LinkedIn URL"),
});
