import type { CreateUserDto, User } from '@synapse/shared-types';

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
  abstract create(data: CreateUserDto & { password: string }): Promise<User>;
}
