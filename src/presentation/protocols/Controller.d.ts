import HttpResponse from './HttpResponse'
import HttpRequest from './HttpRequest'

export default interface Controller {
  handle: (request: HttpRequest) => Promise<HttpResponse>
}
