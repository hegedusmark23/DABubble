export class User {
    name: string;
    email: string;
    password:string;
    profilePicture: string

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.profilePicture = obj ? obj.profilePicture : '';
    }

    public toJSON() {
        return {
            name: this.name,
            email: this.email,
            password: this.password,
            profilePicture: this.profilePicture
        }
    }
}