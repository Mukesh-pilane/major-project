import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  MONGODB_URI: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_AUTH_SECRET: z.string().min(1), // Adjust validation for production
  NEXT_AUTH_URL: z.preprocess(
    (str) => process.env.VERCEL_URL ?? str,
    process.env.VERCEL ? z.string().min(1) : z.string().url()
  ),
  NEXT_GOOGLE_CLIENT_ID: z.string(),
  NEXT_GOOGLE_CLIENT_SECRET: z.string(),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  // Define any client-side environment variables here
  //NEXT_PUBLIC_MY_VARIABLE: z.string().min(1), // Adjust validation for production
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side, so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
  NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
  NEXT_GOOGLE_CLIENT_ID: process.env.NEXT_GOOGLE_CLIENT_ID,
  NEXT_GOOGLE_CLIENT_SECRET: process.env.NEXT_GOOGLE_CLIENT_SECRET,
  // Define any other environment variables here
 
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // Validate all env vars on the server
      : client.safeParse(processEnv) // Validate only exposed env vars on the client
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_")) {
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      }
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
