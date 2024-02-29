import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";
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

const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Please enter your username",
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
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  return (
    <div className="h-screen w-screen grid place-items-center">
      <Card className="max-w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login into your account</CardTitle>
          <CardDescription>
            Enter your email below to login into your account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <ShadForm {...form}>
            <Form>
              <FormBuilder form={form} inputFields={loginFields} />
            </Form>
          </ShadForm>
        </CardContent>

        <CardFooter>
          <Button className="w-full">Create account</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
