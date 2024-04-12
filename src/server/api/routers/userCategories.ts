import { PrismaClient } from '@prisma/client';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "~/utils/config";
import type { JwtPayload } from 'jsonwebtoken';

// Middleware function to verify JWT token
const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error('Failed to authenticate token');
  }
};

export const userCategoryRouter = createTRPCRouter({
    insertUserCategory: publicProcedure
      .input(z.object({ id: z.number(), token: z.string() }))
      .mutation(async ({ input }) => {
        const { id, token } = input;
        const decodedToken = verifyToken(token);
        const userId = Number(decodedToken.sub);
        const prisma = new PrismaClient();  
        try {
          const existingUserCategory = await prisma.userCategory.findFirst({
            where: {
              userId,
              categoryId: id
            }
          });
  
          if (existingUserCategory) {
            await prisma.userCategory.delete({
              where: {
                id: existingUserCategory.id
              }
            });
          } else {
            await prisma.userCategory.create({
              data: {
                userId,
                categoryId: id
              }
            });
          }
          const userCategories = await prisma.userCategory.findMany({
            where: {
              userId 
            }
          });
  
          return { success: true , userCategories }; 
        } catch (error) {
          throw new Error('Failed to insert user category');
        } finally {
          await prisma.$disconnect();
        }
      })
  });
  
