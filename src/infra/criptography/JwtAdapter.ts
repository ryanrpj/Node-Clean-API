import Encrypter from '../../data/protocols/criptography/Encrypter'
import jwt from 'jsonwebtoken'

export default class JwtAdapter implements Encrypter {
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
}
