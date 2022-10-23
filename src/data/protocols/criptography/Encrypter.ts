export default interface Encrypter {
  encrypt: (data: string) => Promise<string>
}
