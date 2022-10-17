import Encrypter from '../../data/protocols/Encrypter'
import bcrypt from 'bcrypt'

export default class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
