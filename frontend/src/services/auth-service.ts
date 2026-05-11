export default class AuthService {
  private _username?: string

  public reset() {
    this._username = undefined
  }

  public setUsername(username: string) {
    this._username = username
  }

  public get isAuthenticated(): boolean {
    return this._username !== undefined
  }

  public get username(): string {
    return this._username
  }
}
