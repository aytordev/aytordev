export interface TmuxWindow {
  readonly name: string;
  readonly index: number;
}

export interface SystemStats {
  readonly cpuLoad: number;
  readonly memoryUsage: number;
  readonly uptime: string;
}

export interface TmuxSession {
  readonly sessionName: string;
  readonly windows: readonly TmuxWindow[];
  readonly activeWindowIndex: number;
  readonly currentBranch: string | null;
  readonly stats: SystemStats;
}
