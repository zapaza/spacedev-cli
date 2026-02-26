export type EntryType = 'command' | 'system' | 'error' | 'success' | 'output' | 'warning';

export interface TerminalEntry {
  id: string;
  type: EntryType;
  content: string;
  timestamp: number;
}

export interface TerminalState {
  history: TerminalEntry[];
  commandHistory: string[];
  historyIndex: number;
}
