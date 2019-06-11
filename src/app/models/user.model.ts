export class User {
  tok: any;
    constructor(
        public email: string, 
        public localId: string,
        private _token: string, 
        private _tokenExpDate: Date ){}

    get token() {
        if (!this._tokenExpDate || new Date() > this._tokenExpDate) {
            return null;
        }
        return this._token;
    }
}