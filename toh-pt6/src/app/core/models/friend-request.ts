export interface FriendRequest {
    id: number;
    fromUserId: number; 
    toUserId: number;   
    createdAt: Date;   
    status: string;     // Může být "pending", "accepted", "declined" 
  }
  