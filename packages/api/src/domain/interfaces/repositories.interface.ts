import {
  AdCampaign,
  AuditLog,
  CreateAdCampaignDto,
  CreateAuditLogDto,
  CreateDailyAdMetricDto,
  CreateIntegrationDto,
  CreateProductDto,
  CreateRoleDto,
  CreateSaleDto,
  CreateUserDto,
  DailyAdMetric,
  Integration,
  Product,
  Role,
  Sale,
  UpdateAdCampaignDto,
  UpdateDailyAdMetricDto,
  UpdateIntegrationDto,
  UpdateProductDto,
  UpdateRoleDto,
  UpdateSaleDto,
  UpdateUserDto,
  User,
} from '@synapse/shared-types';
import { IPaginatedRepository, IRepository } from './repository.interface';

// User Repository Interface
export interface IUserRepository
  extends IRepository<User, CreateUserDto, UpdateUserDto>,
    IPaginatedRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findUsersWithRole(): Promise<User[]>;
  softDelete(id: number): Promise<User>;
}

// Role Repository Interface
export interface IRoleRepository
  extends IRepository<Role, CreateRoleDto, UpdateRoleDto> {
  findByName(name: string): Promise<Role | null>;
}

// Product Repository Interface
export interface IProductRepository
  extends IRepository<Product, CreateProductDto, UpdateProductDto>,
    IPaginatedRepository<Product> {
  findByUserId(userId: number): Promise<Product[]>;
  findProductsWithSales(): Promise<Product[]>;
  softDelete(id: number): Promise<Product>;
}

// Integration Repository Interface
export interface IIntegrationRepository
  extends IRepository<Integration, CreateIntegrationDto, UpdateIntegrationDto> {
  findByUserId(userId: number): Promise<Integration[]>;
  findByPlatform(platformName: string): Promise<Integration[]>;
  updateLastSync(id: number, lastSyncAt: Date): Promise<Integration>;
}

// Ad Campaign Repository Interface
export interface IAdCampaignRepository
  extends IRepository<AdCampaign, CreateAdCampaignDto, UpdateAdCampaignDto> {
  findByProductId(productId: number): Promise<AdCampaign[]>;
  findByIntegrationId(integrationId: number): Promise<AdCampaign[]>;
  findByUserId(userId: number): Promise<AdCampaign[]>;
  findCampaignsWithMetrics(campaignIds: number[]): Promise<AdCampaign[]>;
}

// Daily Ad Metric Repository Interface
export interface IDailyAdMetricRepository
  extends IRepository<
    DailyAdMetric,
    CreateDailyAdMetricDto,
    UpdateDailyAdMetricDto
  > {
  findByCampaignId(campaignId: number): Promise<DailyAdMetric[]>;
  findByCampaignIdAndDateRange(
    campaignId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyAdMetric[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<DailyAdMetric[]>;
  aggregateMetrics(campaignIds: number[]): Promise<{
    totalSpend: number;
    totalClicks: number;
    totalImpressions: number;
    totalConversions: number;
  }>;
}

// Sale Repository Interface
export interface ISaleRepository
  extends IRepository<Sale, CreateSaleDto, UpdateSaleDto>,
    IPaginatedRepository<Sale> {
  findByProductId(productId: number): Promise<Sale[]>;
  findByStatus(status: string): Promise<Sale[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  calculateTotalRevenue(productId?: number): Promise<number>;
  getSalesAnalytics(productId: number): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesByStatus: Record<string, number>;
  }>;
}

// Audit Log Repository Interface
export interface IAuditLogRepository
  extends IRepository<AuditLog, CreateAuditLogDto, never>,
    IPaginatedRepository<AuditLog> {
  findByUserId(userId: number): Promise<AuditLog[]>;
  findByAction(action: string): Promise<AuditLog[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>;
}
