// Domain interfaces for repository abstraction
export interface IRepository<T, CreateDto, UpdateDto> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: number, data: UpdateDto): Promise<T>;
  delete(id: number): Promise<T>;
}

export interface IPaginatedRepository<T> {
  findPaginated(
    page: number,
    limit: number,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
