export interface ErrorLogRepository {
  logError: (stack: string) => Promise<void>
}
