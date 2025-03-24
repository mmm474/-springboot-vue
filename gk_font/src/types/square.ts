import type { Uinfo } from "./user";

export interface SquareList {
  id: number;
  title: string;
  price: number;
  images: string;
  descr: string;
  categorie: string;
  created_at: string;
  likes: number;
  remarks: Remark[]
  user: Uinfo;
}

export interface goodsDetail {
  id: number;
  title: string;
  price: number;
  descr: string;
  categorie: string;
  created_at: string;
  likes: number;
  remarks: Remark[]
  user: Uinfo;
  images: string[];
}

export interface Remark {
  id: number;
  nickname: string;
  avatar: string;
  content: string;
  created_at: string;
  user: Uinfo;
}

export interface upImgResponse {
  url: string
}

export interface reqAddGoodsItem {
  title: string;
  price: number;
  images?: string;
  descr?: string;
  categorie: string;
}

export interface resRemarkData {
  id: number;
  content: string;
}