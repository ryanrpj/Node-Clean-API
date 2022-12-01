import LogControllerDecorator from '../../../decorators/LogControllerDecorator'
import Controller from '../../../../presentation/protocols/Controller'
import LogMongoRepository from '../../../../infra/db/mongodb/log-repository/LogMongoRepository'
import AddSurveyController from '../../../../presentation/controllers/survey/AddSurveyController'
import DbAddSurveyFactory from '../../usecases/add-survey/DbAddSurveyFactory'
import AddSurveyValidationCompositeFactory from './AddSurveyValidationCompositeFactory'

const AddSurveyControllerFactory = {
  makeAddSurveyController (): Controller {
    const validation = AddSurveyValidationCompositeFactory.makeAddSurveyValidationComposite()

    const controller = new AddSurveyController(validation, DbAddSurveyFactory.makeDbAddSurvey())
    return new LogControllerDecorator(controller, new LogMongoRepository())
  }
}

export default AddSurveyControllerFactory
