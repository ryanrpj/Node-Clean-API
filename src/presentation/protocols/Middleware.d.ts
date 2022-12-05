import HttpResponse from './HttpResponse'
import HttpRequest from './HttpRequest'

export default interface Middleware {
  handle: (request: HttpRequest) => Promise<HttpResponse>
}
