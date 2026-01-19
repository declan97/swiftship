import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create a new generation record
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const generationId = await ctx.db.insert('generations', {
      projectId: args.projectId,
      prompt: args.prompt,
      status: 'pending',
      createdAt: Date.now(),
    });
    return generationId;
  },
});

// Mark generation as successful
export const markSuccess = mutation({
  args: {
    id: v.id('generations'),
    response: v.any(),
    componentTree: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      response: args.response,
      componentTree: args.componentTree,
      status: 'success',
    });
  },
});

// Mark generation as failed
export const markError = mutation({
  args: {
    id: v.id('generations'),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      error: args.error,
      status: 'error',
    });
  },
});

// Get generations for a project
export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('generations')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect();
  },
});
