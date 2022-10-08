import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string = process.env.MONGO_URL ?? ''): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map<T> (document: any): T {
    const { _id, ...otherProperties } = document
    return Object.assign({}, otherProperties, { id: _id })
  }
}