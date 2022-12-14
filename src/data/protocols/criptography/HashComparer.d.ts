export default interface HashComparer {
  compare: (text: string, hash: string) => Promise<boolean>
}
