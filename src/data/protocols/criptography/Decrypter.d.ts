export default interface Decrypter {
  decrypt: (data: string) => Promise<string | null>
}
