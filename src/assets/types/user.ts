export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    website?: string;
    followersCount: number;
    followingCount: number;
    createdAt: string;
  }