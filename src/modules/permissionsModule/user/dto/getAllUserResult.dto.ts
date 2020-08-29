import { User } from '../interfaces/user.interface';

export class GetAllUsersResultDto {
  items: User[];
  count: number;
}
