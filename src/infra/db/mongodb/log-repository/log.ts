import ErrorLogRepository from '../../../../data/protocols/error-log-repository'
import MongoHelper from '../helpers/mongo-helper'

export default class LogMongoRepository implements ErrorLogRepository {
  async logError (stack: string): Promise<void> {
    const collection = MongoHelper.getCollection('logs-errors')
    await collection.insertOne({ stack, at: new Date().toISOString() })
  }
}
