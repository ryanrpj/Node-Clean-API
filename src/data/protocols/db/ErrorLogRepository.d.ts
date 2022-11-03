export default interface ErrorLogRepository {
  logError: (stack: string) => Promise<void>
}
