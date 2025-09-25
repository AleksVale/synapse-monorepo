import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
// Import other repositories as they are created
// import { ProductRepository } from './product.repository';
// import { RoleRepository } from './role.repository';

@Global()
@Module({
  providers: [
    UserRepository,
    // Add other repositories here as they are created
    // ProductRepository,
    // RoleRepository,
  ],
  exports: [
    UserRepository,
    // Add other repositories here as they are created
    // ProductRepository,
    // RoleRepository,
  ],
})
export class RepositoryModule {}
