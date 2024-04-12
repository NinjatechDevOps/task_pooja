// users.api.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "~/utils/config";
import { v4 as uuidv4 } from "uuid";

export const uniqueId = () => {
  const uuid = uuidv4();
  return uuid;
};

const createUserInputSchema: z.ZodObject<{
  name: z.ZodString;
  email: z.ZodString;
  password: z.ZodString;
}> = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const loginUserInputSchema: z.ZodObject<{
  email: z.ZodString;
  password: z.ZodString;
}> = z.object({
  email: z.string().email(),
  password: z.string(),
});

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(createUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findFirst({
        where: { email: input.email },
      });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      const verificationCode = "12345678";
      const hashedPassword = await hashPassword(input.password);
      const uid: string = uniqueId();
      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          uuid: uid,
          isEmailVerified: false,
          verificationCode,
        },
      });

      const uuid = user.uuid;
      return { uuid };
    }),

  verify: publicProcedure
    .input(z.object({ uuid: z.string() }))
    .input(z.object({ verificationCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { uuid, verificationCode } = input;
      const user = await ctx.db.user.findFirst({
        where: { uuid },
      });
      if (!user || user.verificationCode !== verificationCode) {
        throw new Error("Invalid verification code");
      }
      const userData = await ctx.db.user.update({
        where: { email: user.email },
        data: { isEmailVerified: true },
      });
      return userData;
    }),

  login: publicProcedure
    .input(loginUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.db.user.findFirst({
        where: { email },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const passwordMatch = await verifyPassword(password, user.password);
      if (!passwordMatch) {
        throw new Error("Invalid email or password");
      }
      const payload = {
        sub: user.id,
        username: user.email,
        uuid: user.uuid,
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1h",
      });

      return { token, id: user.id };
    }),
});
