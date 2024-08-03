export class Message {
  id?: string;
  uid: any;
  date?: boolean;
  message: string;
  weekday: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  milliseconds: number;
  user: any;
  fileUrl: any;
  fileName: any;

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.uid = obj ? obj.uid : '';
    this.date = obj ? obj.date : '';
    this.message = obj ? obj.message : '';
    this.weekday = obj ? obj.weekday : '';
    this.year = obj ? obj.year : '';
    this.month = obj ? obj.month : '';
    this.day = obj ? obj.day : '';
    this.hour = obj ? obj.hour : '';
    this.minute = obj ? obj.minute : '';
    this.seconds = obj ? obj.seconds : '';
    this.milliseconds = obj ? obj.milliseconds : '';
    this.user = obj ? obj.user : '';
    this.fileUrl = obj ? obj.fileUrl : '';
    this.fileName = obj ? obj.fileName : '';
  }
}
