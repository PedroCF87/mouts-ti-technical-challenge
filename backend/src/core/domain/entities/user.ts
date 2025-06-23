// Classe que representa uma entidade User no domínio
export class User {
  id: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
