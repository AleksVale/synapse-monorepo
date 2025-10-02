export enum SaleStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum IntegrationPlatform {
  KIWIFY = 'KIWIFY',
  EDUZZ = 'EDUZZ',
  HOTMART = 'HOTMART',
}

export enum WebhookEventType {
  KIWIFY_ORDER_PAID = 'order.paid',
  KIWIFY_ORDER_REFUNDED = 'order.refunded',
  KIWIFY_ORDER_CHARGEBACK = 'order.chargeback',
  KIWIFY_SUBSCRIPTION_CREATED = 'subscription.created',
  KIWIFY_SUBSCRIPTION_CANCELLED = 'subscription.cancelled',

  EDUZZ_SALE = 'venda',
  EDUZZ_CANCELLATION = 'cancelamento',
  EDUZZ_REFUND = 'reembolso',
  EDUZZ_SUBSCRIPTION_CREATED = 'assinatura_criada',
  EDUZZ_SUBSCRIPTION_CANCELLED = 'assinatura_cancelada',

  HOTMART_PURCHASE_COMPLETE = 'PURCHASE_COMPLETE',
  HOTMART_PURCHASE_REFUNDED = 'PURCHASE_REFUNDED',
  HOTMART_PURCHASE_CHARGEBACK = 'PURCHASE_CHARGEBACK',
  HOTMART_SUBSCRIPTION_CANCELLATION = 'SUBSCRIPTION_CANCELLATION',
  HOTMART_SUBSCRIPTION_REACTIVATION = 'SUBSCRIPTION_REACTIVATION',
}

export enum WebhookStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  IGNORED = 'IGNORED',
}

export interface Role {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  roleId?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  role?: Role;
}

export interface Product {
  id: number;
  userId?: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  user?: User;
}

export interface Integration {
  id: number;
  userId?: number;
  platformName: string;
  apiKey?: string;
  status: string;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface AdCampaign {
  id: number;
  integrationId?: number;
  productId?: number;
  platformCampaignId?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: number;
  user?: User;
  integration?: Integration;
  product?: Product;
}

export interface DailyAdMetric {
  id: number;
  campaignId?: number;
  date: Date;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: number;
  user?: User;
  campaign?: AdCampaign;
}

export interface Sale {
  id: number;
  productId?: number;
  integrationId?: number;
  platformSaleId?: string;
  status: SaleStatus;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  saleDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

export interface AuditLog {
  id: number;
  userId?: number;
  action: string;
  details?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface WebhookLog {
  id: number;
  integrationId?: number;
  platform: IntegrationPlatform;
  eventType: WebhookEventType;
  payload: Record<string, unknown>;
  status: WebhookStatus;
  errorMessage?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  integration?: Integration;
}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  name?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  roleId?: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  userId?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
}

export interface CreateIntegrationDto {
  platformName: string;
  apiKey?: string;
  status: string;
  userId?: number;
}

export interface UpdateIntegrationDto {
  platformName?: string;
  apiKey?: string;
  status?: string;
  lastSyncAt?: Date;
}

export interface CreateAdCampaignDto {
  integrationId?: number;
  productId?: number;
  platformCampaignId?: string;
  name: string;
  userId?: number;
}

export interface UpdateAdCampaignDto {
  integrationId?: number;
  productId?: number;
  platformCampaignId?: string;
  name?: string;
}

export interface CreateDailyAdMetricDto {
  campaignId?: number;
  date: Date;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
  userId?: number;
}

export interface UpdateDailyAdMetricDto {
  spend?: number;
  clicks?: number;
  impressions?: number;
  conversions?: number;
}

export interface CreateSaleDto {
  productId?: number;
  integrationId?: number;
  platformSaleId?: string;
  status: SaleStatus;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  saleDate?: Date;
}

export interface UpdateSaleDto {
  status?: SaleStatus;
  amount?: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  saleDate?: Date;
}

export interface CreateAuditLogDto {
  userId?: number;
  action: string;
  details?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse extends ApiResponse {
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CampaignAnalytics {
  campaign: AdCampaign;
  totalSpend: number;
  totalClicks: number;
  totalImpressions: number;
  totalConversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversionRate: number;
  costPerConversion: number;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface SalesAnalytics {
  product: Product;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  salesByStatus: Record<SaleStatus, number>;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  ROLES: {
    BASE: '/roles',
    BY_ID: (id: number) => `/roles/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: number) => `/products/${id}`,
    BY_USER: (userId: number) => `/products/user/${userId}`,
  },
  INTEGRATIONS: {
    BASE: '/integrations',
    BY_ID: (id: number) => `/integrations/${id}`,
    BY_USER: (userId: number) => `/integrations/user/${userId}`,
    SYNC: (id: number) => `/integrations/${id}/sync`,
  },
  CAMPAIGNS: {
    BASE: '/campaigns',
    BY_ID: (id: number) => `/campaigns/${id}`,
    BY_PRODUCT: (productId: number) => `/campaigns/product/${productId}`,
    ANALYTICS: (id: number) => `/campaigns/${id}/analytics`,
  },
  METRICS: {
    BASE: '/metrics',
    BY_ID: (id: number) => `/metrics/${id}`,
    BY_CAMPAIGN: (campaignId: number) => `/metrics/campaign/${campaignId}`,
  },
  SALES: {
    BASE: '/sales',
    BY_ID: (id: number) => `/sales/${id}`,
    BY_PRODUCT: (productId: number) => `/sales/product/${productId}`,
    ANALYTICS: (productId: number) => `/sales/product/${productId}/analytics`,
  },
  AUDIT_LOGS: {
    BASE: '/audit-logs',
    BY_USER: (userId: number) => `/audit-logs/user/${userId}`,
  },
  WEBHOOKS: {
    KIWIFY: '/webhooks/kiwify',
    EDUZZ: '/webhooks/eduzz',
    HOTMART: '/webhooks/hotmart',
  },
} as const;

export interface KiwifyCustomer {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
}

export interface KiwifyProduct {
  id: string;
  name: string;
}

export interface KiwifyWebhookPayload {
  event: string;
  order_id: string;
  order_ref: string;
  product: KiwifyProduct;
  customer: KiwifyCustomer;
  payment_method: string;
  approved_date?: string;
  amount: number;
  currency: string;
  status: string;
}

export interface EduzzCustomer {
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
}

export interface EduzzProduct {
  cod_produto: number;
  nome_produto: string;
}

export interface EduzzWebhookPayload {
  evento: string;
  trans_cod: number;
  trans_status: string;
  produto: EduzzProduct;
  cliente: EduzzCustomer;
  forma_pagamento: string;
  data_aprovacao?: string;
  valor: number;
  moeda: string;
  token: string;
}

export interface HotmartAddress {
  zipcode: string;
  country: string;
  number: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  complement?: string;
  country_iso: string;
}

export interface HotmartBuyer {
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  checkout_phone: string;
  checkout_phone_code: string;
  document: string;
  document_type: string;
  address: HotmartAddress;
}

export interface HotmartProductContent {
  has_physical_products: boolean;
  products: Array<{
    id: number;
    ucode: string;
    name: string;
    is_physical_product: boolean;
  }>;
}

export interface HotmartProduct {
  id: number;
  ucode: string;
  name: string;
  has_co_production: boolean;
  warranty_date?: string;
  support_email?: string;
  is_physical_product: boolean;
  content?: HotmartProductContent;
}

export interface HotmartAffiliate {
  affiliate_code: string;
  name: string;
}

export interface HotmartProducer {
  name: string;
  legal_nature: string;
  document: string;
}

export interface HotmartCurrencyConversion {
  converted_value: number;
  converted_to_currency: string;
  conversion_rate: number;
}

export interface HotmartCommission {
  value: number;
  currency_value: string;
  source: string;
  currency_conversion?: HotmartCurrencyConversion;
}

export interface HotmartPrice {
  value: number;
  currency_value: string;
}

export interface HotmartOffer {
  code: string;
  coupon_code?: string;
  name: string;
  description?: string;
}

export interface HotmartCheckoutCountry {
  name: string;
  iso: string;
}

export interface HotmartOrigin {
  xcod?: string;
}

export interface HotmartOrderBump {
  is_order_bump: boolean;
  parent_purchase_transaction?: string;
}

export interface HotmartPayment {
  billet_barcode?: string;
  billet_url?: string;
  installments_number?: number;
  pix_code?: string;
  pix_expiration_date?: number;
  pix_qrcode?: string;
  refusal_reason?: string;
  type: string;
}

export interface HotmartEventTickets {
  amount: number;
}

export interface HotmartPurchase {
  approved_date?: number;
  full_price: HotmartPrice;
  original_offer_price?: HotmartPrice;
  price: HotmartPrice;
  offer?: HotmartOffer;
  recurrence_number?: number;
  subscription_anticipation_purchase?: boolean;
  checkout_country: HotmartCheckoutCountry;
  origin?: HotmartOrigin;
  order_bump?: HotmartOrderBump;
  order_date: string;
  date_next_charge?: number;
  status: string;
  transaction: string;
  payment: HotmartPayment;
  is_funnel?: boolean;
  event_tickets?: HotmartEventTickets;
  business_model?: string;
}

export interface HotmartSubscriptionPlan {
  id: number;
  name: string;
}

export interface HotmartSubscriber {
  code: string;
}

export interface HotmartSubscription {
  status: string;
  plan: HotmartSubscriptionPlan;
  subscriber: HotmartSubscriber;
}

export interface HotmartWebhookData {
  product: HotmartProduct;
  affiliates?: HotmartAffiliate[];
  buyer: HotmartBuyer;
  producer: HotmartProducer;
  commissions?: HotmartCommission[];
  purchase: HotmartPurchase;
  subscription?: HotmartSubscription;
}

export interface HotmartWebhookPayload {
  id: string;
  creation_date: number;
  event: string;
  version: string;
  data: HotmartWebhookData;
}

export interface ProcessWebhookDto {
  platform: IntegrationPlatform;
  payload: KiwifyWebhookPayload | EduzzWebhookPayload | HotmartWebhookPayload;
  signature?: string;
  headers?: Record<string, string>;
}

export interface WebhookResponseDto {
  success: boolean;
  message: string;
  webhookLogId?: number;
}
