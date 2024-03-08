import invariant from "tiny-invariant";

type EnvValues = {
  DATABASE_URL: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  SESSION_NAME: string;
  SESSION_SECRET_KEY: string;
};

export const getEnv = (name: keyof EnvValues): string => {
  invariant(name, "Environment name is missing");
  const value = process.env?.[name];
  invariant(value, `Env variable ${name} is not found`);
  return value;
};
