import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Add a message to a project
export const add = mutation({
  args: {
    projectId: v.id('projects'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert('messages', {
      projectId: args.projectId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
    return messageId;
  },
});

// Get messages for a project
export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('asc')
      .collect();
  },
});

// Clear messages for a project
export const clearByProject = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});
