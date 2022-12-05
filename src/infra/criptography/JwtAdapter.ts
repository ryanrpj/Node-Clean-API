import Encrypter from '../../data/protocols/criptography/Encrypter'
import jwt from 'jsonwebtoken'
import Decrypter from '../../data/protocols/criptography/Decrypter'

export default class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (id: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      jwt.sign({ id }, this.secret, {}, (error, token) => {
        if (error) {
          return reject(error)
        }

        return resolve(token!)
      })
    })
  }

  async decrypt (data: string): Promise<string | null> {
    jwt.verify(data, this.secret, {}, () => {})
    return null
  }
}
