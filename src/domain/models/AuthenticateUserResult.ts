export default class AuthenticateUserResult {
  constructor (private readonly authToken?: string) {}

  public isAuthenticated (): boolean {
    return this.authToken != null && this.authToken.length > 0
  }

  public getAuthToken (): string {
    return this.authToken ?? ''
  }
}
