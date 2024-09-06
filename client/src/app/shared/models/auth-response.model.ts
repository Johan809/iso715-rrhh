export class AuthResponse {
  token: string = '';
  data: {
    username: string;
    email: string;
    role: number;
  };

  constructor(obj: Object | any) {
    this.token = <string>obj['token'];
    this.data = obj['data'];
  }
}
