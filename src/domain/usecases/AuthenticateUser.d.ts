import AuthenticateUserResult from '../models/AuthenticateUserResult'

export default interface AuthenticateUser {
  auth: (email: string, password: string) => Promise<AuthenticateUserResult>
}
