import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import { getFormValues } from "~/lib/getFormFields";
import { sessionStorage } from "~/services/session.server";
import { login } from "./signin";
import { User } from "@prisma/client";

export const authenticator = new Authenticator<User>(sessionStorage);

const emailPasswordStragegy = new FormStrategy(async ({ form }) => {
  const { email, password } = await getFormValues<{
    email: string;
    password: string;
  }>(form);
  invariant(email, "Email is required.");
  invariant(password, "Password is required.");
  console.log({ email, password });
  const user = await login(email, password);
  invariant(user, "User not found.");
  return user;
});

authenticator.use(emailPasswordStragegy, "user-pass");
