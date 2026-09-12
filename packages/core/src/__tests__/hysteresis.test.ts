import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Ticker } from '../ticker';

describe('Ticker Dormancy & Autonomous Features', () => {
  let ticker: Ticker;

  beforeEach(() => {
    ticker = Ticker.get();
  });

  afterEach(() => {
    ticker.remove('test-task-1');
    ticker.remove('test-task-2');
  });

  it('pauses and resumes tasks dynamically without unregistering', () => {
    ticker.add('test-task-1', 'update', () => {});
    expect(ticker.hasActiveTasks()).toBe(true);
    expect(ticker.isTaskDormant('test-task-1')).toBe(false);

    // Pause task when offscreen
    ticker.pauseTask('test-task-1');
    expect(ticker.isTaskDormant('test-task-1')).toBe(true);
    expect(ticker.hasActiveTasks()).toBe(false);

    // Resume task when enters visibility margin
    ticker.resumeTask('test-task-1');
    expect(ticker.isTaskDormant('test-task-1')).toBe(false);
    expect(ticker.hasActiveTasks()).toBe(true);
  });

  it('reports hasActiveTasks accurately when multiple tasks are registered', () => {
    ticker.add('test-task-1', 'update', () => {});
    ticker.add('test-task-2', 'render', () => {});

    expect(ticker.hasActiveTasks()).toBe(true);

    ticker.pauseTask('test-task-1');
    // test-task-2 is still active
    expect(ticker.hasActiveTasks()).toBe(true);

    ticker.pauseTask('test-task-2');
    // Both are dormant
    expect(ticker.hasActiveTasks()).toBe(false);

    ticker.resumeTask('test-task-1');
    expect(ticker.hasActiveTasks()).toBe(true);
  });
});
