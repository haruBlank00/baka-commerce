import { prisma } from "~/services/db.server";
import argon2 from "argon2";

export const login = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const hashPassword = user.password;
    const isPasswordsValid = await argon2.verify(hashPassword, password);
    if (!isPasswordsValid) {
      return null;
    }
    return user;
  } catch (e) {
    console.log("[LOGIN SERVICE]:", e);
    return null;
  }
};

export const ownerLogin = async (email: string, password: string) => {
  try {
    const owner = await prisma.owner.findFirst({
      where: {
        email,
      },
    });

    if (!owner) {
      return null;
    }

    const hashPassword = owner.password;
    const isPasswordsValid = await argon2.verify(hashPassword, password);
    if (!isPasswordsValid) {
      return null;
    }
    return owner;
  } catch (e) {
    console.log("[LOGIN SERVICE]:", e);
    return null;
  }
};
