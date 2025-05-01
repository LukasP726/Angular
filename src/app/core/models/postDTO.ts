

export interface PostDTO {
    id?: number | undefined;
    content: string;
    idUser: number;
    idThread: number;
    createdAt: Date;
    idUpload?: number | null;
    owner?: string;
  }