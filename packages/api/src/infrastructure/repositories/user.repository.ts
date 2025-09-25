import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User } from '@synapse/shared-types';
import {
  Role as PrismaRole,
  User as PrismaUser,
} from '../../../generated/prisma';
import { IUserRepository } from '../../domain/interfaces/repositories.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository
  extends BaseRepository<User, CreateUserDto, UpdateUserDto>
  implements IUserRepository
{
  private mapPrismaUserToUser(
    prismaUser: PrismaUser & { role?: PrismaRole | null },
  ): User {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      passwordHash: prismaUser.passwordHash,
      roleId: prismaUser.roleId ?? undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      deletedAt: prismaUser.deletedAt ?? undefined,
      role: prismaUser.role
        ? {
            id: prismaUser.role.id,
            name: prismaUser.role.name,
            createdAt: prismaUser.role.createdAt,
            updatedAt: prismaUser.role.updatedAt,
          }
        : undefined,
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      include: { role: true },
    });
    return users.map((user) => this.mapPrismaUserToUser(user));
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { role: true },
    });
    return user ? this.mapPrismaUserToUser(user) : null;
  }

  async create(data: CreateUserDto): Promise<User> {
    const { password, ...userData } = data;
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash: password, // In real app, this should be hashed
      },
      include: { role: true },
    });
    return this.mapPrismaUserToUser(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const { password, ...updateData } = data;
    const updatePayload = {
      ...updateData,
      ...(password && { passwordHash: password }), // In real app, hash this
    };

    const user = await this.prisma.user.update({
      where: { id },
      data: updatePayload,
      include: { role: true },
    });
    return this.mapPrismaUserToUser(user);
  }

  async delete(id: number): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id },
      include: { role: true },
    });
    return this.mapPrismaUserToUser(user);
  }

  async findPaginated(page: number, limit: number) {
    const { skip, take } = this.calculatePagination(page, limit);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { deletedAt: null },
        include: { role: true },
        skip,
        take,
      }),
      this.prisma.user.count({
        where: { deletedAt: null },
      }),
    ]);

    const data = users.map((user) => this.mapPrismaUserToUser(user));
    return this.formatPaginationResponse(data, total, page, limit);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: { role: true },
    });
    return user ? this.mapPrismaUserToUser(user) : null;
  }

  async findUsersWithRole(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null, roleId: { not: null } },
      include: { role: true },
    });
    return users.map((user) => this.mapPrismaUserToUser(user));
  }

  async softDelete(id: number): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: { role: true },
    });
    return this.mapPrismaUserToUser(user);
  }
}
