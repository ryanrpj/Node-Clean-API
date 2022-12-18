import { Collection, MongoClient, ObjectId } from 'mongodb'

const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string): Promise<void> {
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
    return Object.assign({ id: _id }, otherProperties)
  },

  buildObjectId (id: string): ObjectId {
    return new ObjectId(id)
  }
}

export default MongoHelper
