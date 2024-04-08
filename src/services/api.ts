class API {
  authorizationHeader: string;
  constructor(accesstoken: string) {
    this.authorizationHeader = "Bearer " + accesstoken;
  }
}
