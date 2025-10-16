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
  id: string;
  name: string;
  description?: string;
  userId: string;
  price: number;
  currency: string;
  category?: string;
  status: 'active' | 'inactive' | 'draft';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Integration {
  id: number;
  userId?: number | null;
  platformName: string;
  apiKey?: string | null;
  status: string;
  lastSyncAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User | null;
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
  price?: number;
  currency?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'draft';
  metadata?: Record<string, unknown>;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'draft';
  metadata?: Record<string, unknown>;
}

export interface ProductListItemDto {
  id: number;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  salesCount: number;
  totalRevenue: number;
  integrations: {
    id: number;
    platformName: string;
    status: string;
  }[];
}

export interface ProductDetailsDto extends Product {
  salesCount: number;
  totalRevenue: number;
  averageTicket: number;
  conversionRate?: number;
  integrations: {
    id: number;
    platformName: string;
    status: string;
    salesCount: number;
    revenue: number;
  }[];
  recentSales: {
    id: number;
    amount: number;
    currency: string;
    customerName?: string;
    saleDate: Date;
    platformName: string;
  }[];
}

export interface ListProductsResponseDto
  extends ApiResponse<ProductListItemDto[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export interface IntegrationListItemDto {
  id: number;
  platformName: string;
  status: string;
  lastSyncAt?: Date | null;
  createdAt: Date;
  isHealthy: boolean;
  syncStatus: 'idle' | 'syncing' | 'error';
}

export interface IntegrationDetailsDto extends Integration {
  totalSales: number;
  totalRevenue: number;
  lastSuccessfulSync?: Date;
  errorCount: number;
  products?: Product[];
}

export interface ListIntegrationsResponseDto
  extends ApiResponse<IntegrationListItemDto[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  full_name: string;
  first_name: string;
  email: string;
  mobile?: string;
  CPF?: string;
  ip?: string;
  country?: string;
}

export interface KiwifyProduct {
  product_id: string;
  product_name: string;
}

export interface KiwifyCommissionedStore {
  id: string;
  type: string;
  custom_name: string;
  affiliate_id: string;
  email: string;
  value: string;
}

export interface KiwifyCommissions {
  charge_amount: string;
  currency: string;
  product_base_price: string;
  product_base_price_currency: string;
  kiwify_fee: string;
  kiwify_fee_currency: string;
  commissioned_stores: KiwifyCommissionedStore[];
  my_commission: string;
  funds_status?: string;
  estimated_deposit_date?: string;
  deposit_date?: string;
}

export interface KiwifyTrackingParameters {
  src?: string;
  sck?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface KiwifyCustomerAccess {
  has_access: boolean;
  active_period: boolean;
  access_until: string;
}

export interface KiwifySubscriptionPlan {
  id: string;
  name: string;
  frequency: string;
  qty_charges: number;
}

export interface KiwifyCompletedCharge {
  order_id: string;
  amount: number;
  status: string;
  installments: number;
  card_type?: string;
  card_last_digits?: string;
  card_first_digits?: string;
  created_at: string;
}

export interface KiwifyFutureCharge {
  charge_date: string;
}

export interface KiwifyCharges {
  completed: KiwifyCompletedCharge[];
  future: KiwifyFutureCharge[];
}

export interface KiwifySubscription {
  start_date: string;
  next_payment: string;
  status: string;
  customer_access: KiwifyCustomerAccess;
  plan: KiwifySubscriptionPlan;
  charges: KiwifyCharges;
}

export interface KiwifyWebhookPayload {
  order_id: string;
  order_ref: string;
  order_status: string;
  payment_method: string;
  store_id: string;
  payment_merchant_id: string;
  installments: number;
  card_type?: string;
  card_last4digits?: string;
  card_rejection_reason?: string;
  pix_code?: string;
  pix_expiration?: string;
  boleto_URL?: string;
  boleto_barcode?: string;
  boleto_expiry_date?: string;
  sale_type: string;
  approved_date?: string;
  created_at: string;
  updated_at: string;
  webhook_event_type: string;
  product_type: string;
  Product: KiwifyProduct;
  Customer: KiwifyCustomer;
  Commissions: KiwifyCommissions;
  TrackingParameters: KiwifyTrackingParameters;
  Subscription?: KiwifySubscription;
  subscription_id?: string;
  checkout_link: string;
  access_url: string;
}

export interface EduzzAddress {
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface EduzzBuyer {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  phone2: string;
  cellphone: string;
  address: EduzzAddress;
}

export interface EduzzProducer {
  id: string;
  name: string;
  email: string;
  originSecret: string;
}

export interface EduzzAffiliate {
  id: string;
  name: string;
  email: string;
}

export interface EduzzUtm {
  source?: string;
  campaign?: string;
  medium?: string;
  content?: string;
}

export interface EduzzTracker {
  code1?: string;
  code2?: string;
  code3?: string;
}

export interface EduzzPrice {
  currency: string;
  value: number;
}

export interface EduzzRefundPeriod {
  durationType: string;
  value: number;
}

export interface EduzzCoupon {
  id: string;
  key: string;
  discount: EduzzPrice;
}

export interface EduzzItem {
  productId: string;
  name: string;
  parentId: string;
  refundPeriod: EduzzRefundPeriod;
  price: EduzzPrice;
  coupon: EduzzCoupon;
  partnerId: string;
  billingType: string;
  skuReference: string;
}

export interface EduzzTransaction {
  id: string;
  key: string;
}

export interface EduzzStudent {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  phone2: string;
  cellphone: string;
}

export interface EduzzGains {
  producer: EduzzPrice;
  coproducer: EduzzPrice;
  affiliate: EduzzPrice;
}

export interface EduzzFees {
  eduzz: EduzzPrice;
  recovery: EduzzPrice;
  alumy: EduzzPrice;
  total: EduzzPrice;
}

export interface EduzzRefund {
  type: string;
  createdAt: string;
  refundedAt: string;
  currency: string;
  value: number;
  reason: string;
  refundBy: string;
}

export interface EduzzChargeback {
  status: string;
  createdAt: string;
  limitDate: string;
  finishedAt?: string;
}

export interface EduzzBankSlipInstallment {
  installmentNumber: number;
  totalInstallments: number;
}

export interface EduzzInvoiceData {
  id: string;
  status: string;
  buyer: EduzzBuyer;
  producer: EduzzProducer;
  affiliate?: EduzzAffiliate;
  utm: EduzzUtm;
  tracker: EduzzTracker;
  createdAt: string;
  dueDate: string;
  barcode?: string;
  price: EduzzPrice;
  paid: EduzzPrice;
  paymentMethod?: string;
  installments: number;
  transaction?: EduzzTransaction;
  items: EduzzItem[];
  totalItems: number;
  billetUrl?: string;
  checkoutUrl?: string;
  bankslipUrl?: string;
  paidAt?: string;
  refundedAt?: string;
  student: EduzzStudent;
  gains?: EduzzGains;
  fees?: EduzzFees;
  refund?: EduzzRefund;
  chargeback?: EduzzChargeback;
  bankSlipInstallment?: EduzzBankSlipInstallment;
}

export interface EduzzWebhookPayload {
  id: string;
  event: string;
  data: EduzzInvoiceData;
  sentDate: string;
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
