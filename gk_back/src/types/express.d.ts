import { Request } from "express";

export interface UInfo {
  iat: number;
  exp: number;
  username: string;
  [key: string]: any;
}

interface uFile {
  path: any;
  filePath: string;
}

declare global {
  namespace Express {
    interface Request {
      uInfo?: UInfo; // 或者使用更具体的类型
      file: uFile
    }
  }
}