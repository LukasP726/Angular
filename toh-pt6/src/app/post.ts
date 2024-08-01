export interface Post {
    id?: number | undefined;
    //id: number;
    content: string;
    idUser: number;
    idThread: number;
    createdAt: Date;
    idUpload?: number | null;
  }
  