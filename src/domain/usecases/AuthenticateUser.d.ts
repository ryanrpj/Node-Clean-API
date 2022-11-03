import AuthenticateCredentials from './AuthenticateCredentials'

export default interface AuthenticateUser {
  auth: (credentials: AuthenticateCredentials) => Promise<string>
}
