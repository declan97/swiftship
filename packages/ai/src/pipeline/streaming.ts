/**
 * Server-Sent Events (SSE) helpers for streaming generation.
 * Provides utilities for progressive UI updates during AI generation.
 */

import type { ComponentNode } from '@swiftship/core';

/**
 * SSE event types
 */
export type SSEEventType =
  | 'start'
  | 'text'
  | 'progress'
  | 'component'
  | 'complete'
  | 'error';

/**
 * SSE event data structures
 */
export interface SSEStartEvent {
  type: 'start';
  data: {
    generationId: string;
    styleId: string;
    timestamp: number;
  };
}

export interface SSETextEvent {
  type: 'text';
  data: {
    text: string;
    accumulated: string;
  };
}

export interface SSEProgressEvent {
  type: 'progress';
  data: {
    stage: 'generating' | 'parsing' | 'validating';
    progress: number; // 0-100
    message?: string;
  };
}

export interface SSEComponentEvent {
  type: 'component';
  data: {
    componentTree: ComponentNode;
    partial: boolean;
  };
}

export interface SSECompleteEvent {
  type: 'complete';
  data: {
    componentTree: ComponentNode;
    rawResponse: string;
    metadata: {
      styleId: string;
      generationTime: number;
      inputTokens?: number;
      outputTokens?: number;
    };
  };
}

export interface SSEErrorEvent {
  type: 'error';
  data: {
    code: string;
    message: string;
    recoverable: boolean;
  };
}

export type SSEEvent =
  | SSEStartEvent
  | SSETextEvent
  | SSEProgressEvent
  | SSEComponentEvent
  | SSECompleteEvent
  | SSEErrorEvent;

/**
 * Format an SSE event for transmission
 */
export function formatSSEEvent(event: SSEEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
}

/**
 * Parse an SSE event from a string
 */
export function parseSSEEvent(eventString: string): SSEEvent | null {
  try {
    const lines = eventString.trim().split('\n');
    let eventType: SSEEventType | null = null;
    let data: string | null = null;

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        eventType = line.slice(7) as SSEEventType;
      } else if (line.startsWith('data: ')) {
        data = line.slice(6);
      }
    }

    if (!eventType || !data) return null;

    return {
      type: eventType,
      data: JSON.parse(data),
    } as SSEEvent;
  } catch {
    return null;
  }
}

/**
 * Create an SSE stream encoder
 */
export class SSEEncoder {
  private encoder = new TextEncoder();

  encode(event: SSEEvent): Uint8Array {
    return this.encoder.encode(formatSSEEvent(event));
  }

  encodeStart(generationId: string, styleId: string): Uint8Array {
    return this.encode({
      type: 'start',
      data: {
        generationId,
        styleId,
        timestamp: Date.now(),
      },
    });
  }

  encodeText(text: string, accumulated: string): Uint8Array {
    return this.encode({
      type: 'text',
      data: { text, accumulated },
    });
  }

  encodeProgress(
    stage: 'generating' | 'parsing' | 'validating',
    progress: number,
    message?: string
  ): Uint8Array {
    return this.encode({
      type: 'progress',
      data: { stage, progress, message },
    });
  }

  encodeComponent(componentTree: ComponentNode, partial: boolean): Uint8Array {
    return this.encode({
      type: 'component',
      data: { componentTree, partial },
    });
  }

  encodeComplete(
    componentTree: ComponentNode,
    rawResponse: string,
    metadata: SSECompleteEvent['data']['metadata']
  ): Uint8Array {
    return this.encode({
      type: 'complete',
      data: { componentTree, rawResponse, metadata },
    });
  }

  encodeError(
    code: string,
    message: string,
    recoverable: boolean = false
  ): Uint8Array {
    return this.encode({
      type: 'error',
      data: { code, message, recoverable },
    });
  }
}

/**
 * Create an SSE stream from an async generator
 */
export function createSSEStream(
  generator: () => AsyncGenerator<SSEEvent, void, unknown>
): ReadableStream<Uint8Array> {
  const encoder = new SSEEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of generator()) {
          controller.enqueue(encoder.encode(event));
        }
        controller.close();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          encoder.encodeError('STREAM_ERROR', errorMessage, false)
        );
        controller.close();
      }
    },
  });
}

/**
 * Client-side SSE event reader
 */
export class SSEReader {
  private buffer = '';
  private decoder = new TextDecoder();

  /**
   * Process a chunk of SSE data
   */
  processChunk(chunk: Uint8Array): SSEEvent[] {
    this.buffer += this.decoder.decode(chunk, { stream: true });
    const events: SSEEvent[] = [];

    // Split on double newlines (SSE event separator)
    const parts = this.buffer.split('\n\n');

    // Keep the last incomplete part in the buffer
    this.buffer = parts.pop() ?? '';

    for (const part of parts) {
      const event = parseSSEEvent(part);
      if (event) {
        events.push(event);
      }
    }

    return events;
  }

  /**
   * Flush any remaining data in the buffer
   */
  flush(): SSEEvent[] {
    if (!this.buffer.trim()) return [];

    const event = parseSSEEvent(this.buffer);
    this.buffer = '';

    return event ? [event] : [];
  }
}

/**
 * Create SSE response headers
 */
export function createSSEHeaders(): Headers {
  return new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable Nginx buffering
  });
}

/**
 * Helper to consume an SSE stream with callbacks
 */
export async function consumeSSEStream(
  stream: ReadableStream<Uint8Array>,
  callbacks: {
    onStart?: (data: SSEStartEvent['data']) => void;
    onText?: (data: SSETextEvent['data']) => void;
    onProgress?: (data: SSEProgressEvent['data']) => void;
    onComponent?: (data: SSEComponentEvent['data']) => void;
    onComplete?: (data: SSECompleteEvent['data']) => void;
    onError?: (data: SSEErrorEvent['data']) => void;
  }
): Promise<void> {
  const reader = new SSEReader();
  const streamReader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await streamReader.read();

      if (done) {
        // Process any remaining data
        for (const event of reader.flush()) {
          dispatchEvent(event, callbacks);
        }
        break;
      }

      for (const event of reader.processChunk(value)) {
        dispatchEvent(event, callbacks);
      }
    }
  } finally {
    streamReader.releaseLock();
  }
}

function dispatchEvent(
  event: SSEEvent,
  callbacks: Parameters<typeof consumeSSEStream>[1]
): void {
  switch (event.type) {
    case 'start':
      callbacks.onStart?.(event.data);
      break;
    case 'text':
      callbacks.onText?.(event.data);
      break;
    case 'progress':
      callbacks.onProgress?.(event.data);
      break;
    case 'component':
      callbacks.onComponent?.(event.data);
      break;
    case 'complete':
      callbacks.onComplete?.(event.data);
      break;
    case 'error':
      callbacks.onError?.(event.data);
      break;
  }
}
