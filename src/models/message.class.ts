export class Message {
  id?: string;
  message: string;
  weekday: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  user: any;

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.message = obj ? obj.message : '';
    this.weekday = obj ? obj.weekday : '';
    this.year = obj ? obj.year : '';
    this.month = obj ? obj.month : '';
    this.day = obj ? obj.day : '';
    this.hour = obj ? obj.hour : '';
    this.minute = obj ? obj.minute : '';
    this.seconds = obj ? obj.seconds : '';
    this.user = obj ? obj.user : '';
  }
}
