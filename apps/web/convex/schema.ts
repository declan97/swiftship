import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Projects table
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    componentTree: v.optional(v.any()), // ComponentNode tree as JSON
    generatedCode: v.optional(v.string()),
    appConfig: v.optional(v.any()), // AppConfig as JSON
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Generation history for a project
  generations: defineTable({
    projectId: v.id('projects'),
    prompt: v.string(),
    response: v.optional(v.any()), // AI response as JSON
    componentTree: v.optional(v.any()), // Resulting component tree
    status: v.union(v.literal('pending'), v.literal('success'), v.literal('error')),
    error: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_project', ['projectId']),

  // Chat messages within a project
  messages: defineTable({
    projectId: v.id('projects'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
    createdAt: v.number(),
  }).index('by_project', ['projectId']),
});
