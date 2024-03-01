import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
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
import { getFormValues } from "~/lib/getFormFields";
import { fromZodError, fromZodIssue } from "zod-validation-error";
import { useEffect } from "react";
import invariant from "tiny-invariant";
const loginSchema = z.object({
  email: z.string().min(2, {
    message: "Please enter your email address",
  }),
  password: z.string().min(8, {
    message: "Please enter your password",
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

export default function SignupPage() {
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  console.log({ actionData });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: TLoginSchema) => {
    console.log({ data });
    submit(data, { method: "POST" });
  };

  return (
    <div className="h-screen w-screen grid place-items-center">
      <Card className="max-w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login into your account</CardTitle>
          <CardDescription>
            Enter your email below to login into your account
          </CardDescription>
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
  const { email, password } = await getFormValues<TLoginSchema>(request);
  invariant(email, "Email is required.");
  invariant(password, "Password is required.");

  return null;
};
