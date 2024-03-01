import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "user_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["secretkey"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const getSession = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  invariant(cookie, "Cookie is missing :(");

  return await sessionStorage.getSession(cookie);
};
