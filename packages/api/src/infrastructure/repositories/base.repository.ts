import { Injectable } from '@nestjs/common';
import {
  IPaginatedRepository,
  IRepository,
} from '../../domain/interfaces/repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export abstract class BaseRepository<T, CreateDto, UpdateDto>
  implements IRepository<T, CreateDto, UpdateDto>, IPaginatedRepository<T>
{
  constructor(protected readonly prisma: PrismaService) {}

  abstract findAll(): Promise<T[]>;
  abstract findById(id: number): Promise<T | null>;
  abstract create(data: CreateDto): Promise<T>;
  abstract update(id: number, data: UpdateDto): Promise<T>;
  abstract delete(id: number): Promise<T>;

  abstract findPaginated(
    page: number,
    limit: number,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  protected calculatePagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }

  protected formatPaginationResponse<U>(
    data: U[],
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
