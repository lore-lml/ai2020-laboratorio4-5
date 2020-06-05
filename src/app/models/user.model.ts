interface JwtDetails {
  email: string;
  exp: number;
  iat: number;
  sub: string;
}
export class User{
  private static jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  private readonly jwt: string;
  private details: JwtDetails;

  constructor(jwt: string) {
    if (!jwt.match(User.jwtRegex)){
      throw new Error('Parameter doesn\'t look like JWT');
    }
    this.jwt = jwt;
    const json = JSON.parse(atob(jwt.split('.')[1]));
    this.details = {
      email: json.email,
      exp: json.exp,
      iat: json.iat,
      sub: json.sub
    };
  }

  isTokenExpired(){
    return Date.now() >= this.details.exp * 1000;
  }

  getEmail(){
    return this.details.email;
  }

  getTokenExpirationDate(){
    const date = new Date(this.details.exp * 1000);
    date.setUTCHours(15);
    return date;
  }

  getTokenDuration(){
    return this.details.exp - this.details.iat;
  }

  getTokenGenerationDate(){
    const date = new Date(this.details.iat * 1000);
    date.setUTCHours(15);
    return date;
  }

  getJwt(){
    return this.jwt;
  }
}
