export interface Task {
    ID: string;
    _id:string,
    Title: string;
    StartTime: string;
    EndTime: string;
    Priority: number;
    Status: "pending"|"finished";
  }