import { User } from "./user";

export interface Post {
  user: any;
  id: string;
  _id: string;
  text: string;
  createdAt: string;
  image?: string;
  tags?: string[];
  likes?: string[];
  commentCount?: number;
  userId: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}
