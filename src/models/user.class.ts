export class User {
    id: string;
    name: string;
    email: string;
    password:string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
        }
    }
}