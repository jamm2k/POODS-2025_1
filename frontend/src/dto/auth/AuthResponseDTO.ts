import { User } from '../../context/AuthContext';

export interface AuthResponseDTO {
  token: string;
  user: User;
}