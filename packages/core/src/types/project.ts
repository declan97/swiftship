import { z } from 'zod';
import type { AppDefinition } from './app.js';

/**
 * Project status in the pipeline.
 */
export type ProjectStatus = 'draft' | 'generating' | 'ready' | 'building' | 'error';

/**
 * A generation request/response pair.
 */
export interface Generation {
  id: string;
  prompt: string;
  response: AppDefinition | null;
  error: string | null;
  tokensUsed: number;
  createdAt: Date;
}

/**
 * Build configuration for cloud builds.
 */
export interface BuildConfig {
  configuration: 'debug' | 'release';
  destination: 'simulator' | 'device' | 'testflight' | 'appstore';
}

/**
 * Build status and result.
 */
export interface Build {
  id: string;
  projectId: string;
  config: BuildConfig;
  status: 'queued' | 'building' | 'succeeded' | 'failed';
  startedAt: Date | null;
  completedAt: Date | null;
  artifactUrl: string | null;
  logs: string | null;
  error: string | null;
}

/**
 * A user project in SwiftShip.
 */
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;

  // The app definition (core data)
  appDefinition: AppDefinition | null;

  // Conversation history for multi-turn generation
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;

  // Status
  status: ProjectStatus;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generated file from codegen.
 */
export interface GeneratedFile {
  path: string; // e.g., "Sources/Views/HomeView.swift"
  content: string;
}

/**
 * Result of code generation.
 */
export interface CodegenResult {
  files: GeneratedFile[];
  warnings: string[];
  xcodeProjectPath: string;
}
