export default interface TokenGenerator {
  generate: (data: string) => Promise<string>
}
