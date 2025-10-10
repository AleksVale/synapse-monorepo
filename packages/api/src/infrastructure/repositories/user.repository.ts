import { Injectable } from '@nestjs/common';
import type { CreateUserDto, User } from '@synapse/shared-types';
import { IUserRepository } from '../../domain/repositories';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: { role: true },
    });

    if (!user) return null;

    return this.mapToUser(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { role: true },
    });

    if (!user) return null;

    return this.mapToUser(user);
  }

  async create(data: CreateUserDto & { password: string }): Promise<User> {
    const { password, ...userData } = data;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash: password,
      },
      include: { role: true },
    });

    return this.mapToUser(user);
  }

  // Helper para mapear tipos Prisma para User do shared-types
  private mapToUser(prismaUser: {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    roleId: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    role?: {
      id: number;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  }): User {
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
}
