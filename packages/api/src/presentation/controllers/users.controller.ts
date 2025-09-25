import { Controller, Get } from '@nestjs/common';
import { ApiResponse, User } from '@synapse/shared-types';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Controller('users')
export class UsersController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  async findAll(): Promise<ApiResponse<User[]>> {
    try {
      const users = await this.userRepository.findAll();
      return {
        success: true,
        data: users,
        message: 'Users retrieved successfully',
      };
    } catch {
      return {
        success: false,
        error: 'Failed to retrieve users',
      };
    }
  }
}
