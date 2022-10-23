export default interface AuthenticateUser {
  auth: (email: string, password: string) => Promise<string>
}
