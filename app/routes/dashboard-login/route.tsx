import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ShadForm } from "~/components/ui/form";
import { FormBuilder, InputField } from "~/components/ui/form-buildler";
import { authenticator, ownerAuthenticator } from "~/services/auth.server";

const loginSchema = z.object({
  email: z.string().min(2, {
    message: "Please enter your email address.",
  }),
  password: z.string().min(8, {
    message: "Please enter your password.",
  }),
});

const loginFields: InputField[] = [
  {
    name: "email",
    placeholder: "johndoe@baka.com",
    label: "Email",
    type: "email",
  },
  {
    name: "password",
    placeholder: "********",
    label: "Password",
    type: "password",
  },
];

type TLoginSchema = z.infer<typeof loginSchema>;
const resolver = zodResolver(loginSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await ownerAuthenticator.isAuthenticated(request, {
    successRedirect: "/store/dashboard",
  });
};
export default function LoginPage() {
  const submit = useSubmit();

  const form = useForm({
    resolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: TLoginSchema) => {
    submit(data, {
      method: "post",
    });
  };

  return (
    <div className="h-screen w-screen grid place-items-center">
      <Card className="max-w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login into your account</CardTitle>
          <CardDescription>Login into your store dashboard :)</CardDescription>
        </CardHeader>

        <ShadForm {...form}>
          <Form method="POST" onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="grid grid-cols-1 gap-2">
              <FormBuilder form={form} inputFields={loginFields} />
            </CardContent>

            <CardFooter>
              <Button className="w-full" type="submit">
                Sign In
              </Button>
            </CardFooter>
          </Form>
        </ShadForm>
      </Card>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await ownerAuthenticator.authenticate("owner-auth", request, {
    successRedirect: "store/dashboard",
    failureRedirect: "/dashboard-login",
  });
};
