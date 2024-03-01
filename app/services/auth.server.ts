import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import { getFormValues } from "~/lib/getFormFields";
import { sessionStorage } from "~/services/session.server";

export const authenticator = new Authenticator<{
  email: string;
  password: string;
}>(sessionStorage);

const emailPasswordStragegy = new FormStrategy(async ({ form }) => {
  const { email, password } = await getFormValues<{
    email: string;
    password: string;
  }>(form);
  invariant(email, "Email is required.");
  invariant(password, "Password is required.");

  // let user = await login(email, password);
  return { email: "email", password: "password" };
});

authenticator.use(emailPasswordStragegy, "user-pass");

const login = async (email: string, password: string) => {
  // const user = await
};
