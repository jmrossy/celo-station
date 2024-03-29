import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { logger } from './logger';

export function isClipboardReadSupported() {
  return !!navigator?.clipboard?.readText;
}

export async function tryClipboardSet(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch (error) {
    logger.error('Failed to set clipboard', error);
    return false;
  }
}

export async function tryClipboardGet() {
  try {
    // Note: doesn't work in firefox, which only allows extensions to read clipboard
    const value = await navigator.clipboard.readText();
    return value;
  } catch (error) {
    logger.error('Failed to read from clipboard', error);
    return null;
  }
}

export function useCopyHandler(value?: string, onDone?: () => void) {
  return useCallback(async () => {
    if (!value) return;
    const result = await tryClipboardSet(value);
    if (result) toast.success('Copied to clipboard', { autoClose: 1200 });
    if (onDone) onDone();
  }, [value, onDone]);
}
