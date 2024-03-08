import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getEnv } from "~/lib/getEnv";

/**
 * we create a session storage for authentication and session management
 */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: getEnv("SESSION_NAME"),
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [getEnv("SESSION_SECRET_KEY")],
    secure: process.env.NODE_ENV === "production",
  },
});

/**
 *  returns the current active session 
 * @param request
 * @returns
 */
export const getSession = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  invariant(cookie, "Cookie is missing :(");

  return await sessionStorage.getSession(cookie);
};
