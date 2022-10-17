import ErrorLogRepository from '../../../../data/protocols/ErrorLogRepository'
import MongoHelper from '../helpers/MongoHelper'

export default class LogMongoRepository implements ErrorLogRepository {
  async logError (stack: string): Promise<void> {
    const collection = MongoHelper.getCollection('logs-errors')
    await collection.insertOne({ stack, at: new Date().toISOString() })
  }
}
