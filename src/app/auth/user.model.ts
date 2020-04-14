export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    } else {
      return this._token;
    }
  }

  get tokenDuration() {
    if (!this._token) {
      return 0;
    }

    // Test expired
    // return 2000; // 2 seconds
    // If less than or equal to 0 means expired
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
