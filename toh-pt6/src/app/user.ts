export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  email: string;
  idRole: number;
}

export interface Role {
  id: number;
  name: string;
  weight: number;
}
