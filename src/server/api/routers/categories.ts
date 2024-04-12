import { PrismaClient } from '@prisma/client';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod';
import { faker } from '@faker-js/faker';

const generateCategories = (count: number) => {
    const categories = [];
    for (let i = 0; i < count; i++) {
      const category = {
        name: faker.commerce.department(),
      };
      categories.push(category);
    }
    return categories;
};

export const categoryRouter = createTRPCRouter({
  insertCategories: publicProcedure
    .input(z.object({ count: z.number() })) 
    .mutation(async ({ ctx, input }) => {
      const { count } = input;
      const prisma = new PrismaClient();
      try {
        const existingCategories = await ctx.db.category.findMany();
        if (existingCategories.length === 0) {
          const categoriesToInsert = generateCategories(count);
          await ctx.db.category.createMany({ data: categoriesToInsert });
          return { success: true };
        } else {
        }
      } catch (error) {
        throw new Error('Failed to insert categories');
      } finally {
        await prisma.$disconnect(); 
      }
    }),

    getCategories: publicProcedure
    .query(async ({ ctx }) => {
      const prisma = new PrismaClient();
      try {
        const categories = await ctx.db.category.findMany();
        return {data:categories};
      } catch (error) {
        throw new Error('Failed to fetch categories');
      } finally {
        await prisma.$disconnect();
      }
    })

 
});

