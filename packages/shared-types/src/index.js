export var SaleStatus;
(function (SaleStatus) {
    SaleStatus["PENDING"] = "PENDING";
    SaleStatus["CONFIRMED"] = "CONFIRMED";
    SaleStatus["CANCELLED"] = "CANCELLED";
    SaleStatus["REFUNDED"] = "REFUNDED";
})(SaleStatus || (SaleStatus = {}));
export var IntegrationPlatform;
(function (IntegrationPlatform) {
    IntegrationPlatform["KIWIFY"] = "KIWIFY";
    IntegrationPlatform["EDUZZ"] = "EDUZZ";
    IntegrationPlatform["HOTMART"] = "HOTMART";
})(IntegrationPlatform || (IntegrationPlatform = {}));
export var WebhookEventType;
(function (WebhookEventType) {
    WebhookEventType["KIWIFY_ORDER_PAID"] = "order.paid";
    WebhookEventType["KIWIFY_ORDER_REFUNDED"] = "order.refunded";
    WebhookEventType["KIWIFY_ORDER_CHARGEBACK"] = "order.chargeback";
    WebhookEventType["KIWIFY_SUBSCRIPTION_CREATED"] = "subscription.created";
    WebhookEventType["KIWIFY_SUBSCRIPTION_CANCELLED"] = "subscription.cancelled";
    WebhookEventType["EDUZZ_SALE"] = "venda";
    WebhookEventType["EDUZZ_CANCELLATION"] = "cancelamento";
    WebhookEventType["EDUZZ_REFUND"] = "reembolso";
    WebhookEventType["EDUZZ_SUBSCRIPTION_CREATED"] = "assinatura_criada";
    WebhookEventType["EDUZZ_SUBSCRIPTION_CANCELLED"] = "assinatura_cancelada";
    WebhookEventType["HOTMART_PURCHASE_COMPLETE"] = "PURCHASE_COMPLETE";
    WebhookEventType["HOTMART_PURCHASE_REFUNDED"] = "PURCHASE_REFUNDED";
    WebhookEventType["HOTMART_PURCHASE_CHARGEBACK"] = "PURCHASE_CHARGEBACK";
    WebhookEventType["HOTMART_SUBSCRIPTION_CANCELLATION"] = "SUBSCRIPTION_CANCELLATION";
    WebhookEventType["HOTMART_SUBSCRIPTION_REACTIVATION"] = "SUBSCRIPTION_REACTIVATION";
})(WebhookEventType || (WebhookEventType = {}));
export var WebhookStatus;
(function (WebhookStatus) {
    WebhookStatus["PENDING"] = "PENDING";
    WebhookStatus["PROCESSING"] = "PROCESSING";
    WebhookStatus["SUCCESS"] = "SUCCESS";
    WebhookStatus["FAILED"] = "FAILED";
    WebhookStatus["IGNORED"] = "IGNORED";
})(WebhookStatus || (WebhookStatus = {}));
export var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["CREATED"] = 201] = "CREATED";
    HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCode[HttpStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCode[HttpStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusCode || (HttpStatusCode = {}));
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
    },
    USERS: {
        BASE: '/users',
        BY_ID: (id) => `/users/${id}`,
        PROFILE: '/users/profile',
    },
    ROLES: {
        BASE: '/roles',
        BY_ID: (id) => `/roles/${id}`,
    },
    PRODUCTS: {
        BASE: '/products',
        BY_ID: (id) => `/products/${id}`,
        BY_USER: (userId) => `/products/user/${userId}`,
    },
    INTEGRATIONS: {
        BASE: '/integrations',
        BY_ID: (id) => `/integrations/${id}`,
        BY_USER: (userId) => `/integrations/user/${userId}`,
        SYNC: (id) => `/integrations/${id}/sync`,
    },
    CAMPAIGNS: {
        BASE: '/campaigns',
        BY_ID: (id) => `/campaigns/${id}`,
        BY_PRODUCT: (productId) => `/campaigns/product/${productId}`,
        ANALYTICS: (id) => `/campaigns/${id}/analytics`,
    },
    METRICS: {
        BASE: '/metrics',
        BY_ID: (id) => `/metrics/${id}`,
        BY_CAMPAIGN: (campaignId) => `/metrics/campaign/${campaignId}`,
    },
    SALES: {
        BASE: '/sales',
        BY_ID: (id) => `/sales/${id}`,
        BY_PRODUCT: (productId) => `/sales/product/${productId}`,
        ANALYTICS: (productId) => `/sales/product/${productId}/analytics`,
    },
    AUDIT_LOGS: {
        BASE: '/audit-logs',
        BY_USER: (userId) => `/audit-logs/user/${userId}`,
    },
    WEBHOOKS: {
        KIWIFY: '/webhooks/kiwify',
        EDUZZ: '/webhooks/eduzz',
        HOTMART: '/webhooks/hotmart',
    },
};
//# sourceMappingURL=index.js.map