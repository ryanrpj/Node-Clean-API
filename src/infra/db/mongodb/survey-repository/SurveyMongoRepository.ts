import AddSurveyRepository from '../../../../data/protocols/db/AddSurveyRepository'
import { AddSurveyModel } from '../../../../domain/usecases/survey/AddSurvey'
import Survey from '../../../../domain/models/survey/Survey'
import MongoHelper from '../helpers/MongoHelper'

export default class SurveyMongoRepository implements AddSurveyRepository {
  async add (survey: AddSurveyModel): Promise<Survey> {
    const collection = MongoHelper.getCollection('surveys')
    const { insertedId } = await collection.insertOne(survey)
    const insertedSurvey = await collection.findOne({ _id: insertedId })

    return MongoHelper.map<Survey>(insertedSurvey)
  }
}
