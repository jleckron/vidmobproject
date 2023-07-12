import { Injectable } from '@nestjs/common';
import { UserGQL } from './models/user_gql.model';

@Injectable()
export class UsersGQLService {
  async getAll(): Promise<UserGQL[]> {
    const user = new UserGQL();
    return [user];
  }
}
