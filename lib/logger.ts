/**
 * Logs a debug message to the console, preceded by a UTF-8 space character for 'Bug' emoji.
 * @param args 
 */
export function logDebug(...args: unknown[]) {
  console.debug('🐛', ...args)
}