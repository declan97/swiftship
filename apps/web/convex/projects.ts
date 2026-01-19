import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create a new project
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const projectId = await ctx.db.insert('projects', {
      name: args.name,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
    return projectId;
  },
});

// Get a project by ID
export const get = query({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List all projects
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('projects').order('desc').collect();
  },
});

// Update project component tree
export const updateComponentTree = mutation({
  args: {
    id: v.id('projects'),
    componentTree: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      componentTree: args.componentTree,
      updatedAt: Date.now(),
    });
  },
});

// Update project generated code
export const updateGeneratedCode = mutation({
  args: {
    id: v.id('projects'),
    generatedCode: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      generatedCode: args.generatedCode,
      updatedAt: Date.now(),
    });
  },
});

// Update project app config
export const updateAppConfig = mutation({
  args: {
    id: v.id('projects'),
    appConfig: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      appConfig: args.appConfig,
      updatedAt: Date.now(),
    });
  },
});

// Delete a project
export const remove = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    // Delete all related generations
    const generations = await ctx.db
      .query('generations')
      .withIndex('by_project', (q) => q.eq('projectId', args.id))
      .collect();
    for (const gen of generations) {
      await ctx.db.delete(gen._id);
    }

    // Delete all related messages
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_project', (q) => q.eq('projectId', args.id))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    // Delete the project
    await ctx.db.delete(args.id);
  },
});
