import Hasher from '../../data/protocols/criptography/Hasher'
import bcrypt from 'bcrypt'
import HashComparer from '../../data/protocols/criptography/HashComparer'

export default class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (text: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(text, hash)
  }
}
