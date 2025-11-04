import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const list = query({
  async handler(ctx) {
    return await ctx.db.query('todos').collect();
  },
});

export const create = mutation({
  args: {
    text: v.string(),
  },
  async handler(ctx, args) {
    return await ctx.db.insert('todos', {
      text: args.text,
      done: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('todos'),
    done: v.boolean(),
  },
  async handler(ctx, args) {
    return await ctx.db.patch(args.id, { done: args.done });
  },
});

export const remove = mutation({
  args: {
    id: v.id('todos'),
  },
  async handler(ctx, args) {
    return await ctx.db.delete(args.id);
  },
});
