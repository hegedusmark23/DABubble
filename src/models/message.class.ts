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
  threadCount?: any;
  thumbsUp: any;
  thumbsDown: any;
  rocket: any;
  nerdFace: any;
  noted: any;
  panda: any;
  shushingFace: any;
  
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
    this.threadCount = obj ? obj.threadCount : '';
    this.thumbsUp = obj ? obj.thumbsUp : '';
    this.thumbsDown = obj ? obj.thumbsDown : '';
    this.rocket = obj ? obj.rocket : '';
    this.nerdFace = obj ? obj.nerdFace : '';
    this.noted = obj ? obj.noted : '';
    this.panda = obj ? obj.panda : '';
    this.shushingFace = obj ? obj.shushingFace : '';
  }
}
