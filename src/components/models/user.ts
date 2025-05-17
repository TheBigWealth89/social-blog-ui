export interface User {
    userId: any;
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    website?: string;
    followersCount: number;
    followingCount: number;
    createdAt: string;
  }