-- CreateEnum
CREATE TYPE "public"."IntegrationPlatform" AS ENUM ('KIWIFY', 'EDUZZ', 'HOTMART');

-- CreateEnum
CREATE TYPE "public"."WebhookEventType" AS ENUM ('KIWIFY_ORDER_PAID', 'KIWIFY_ORDER_REFUNDED', 'KIWIFY_ORDER_CHARGEBACK', 'EDUZZ_VENDA', 'EDUZZ_CANCELAMENTO', 'EDUZZ_REEMBOLSO', 'HOTMART_PURCHASE_COMPLETE', 'HOTMART_PURCHASE_REFUNDED', 'HOTMART_PURCHASE_CHARGEBACK', 'HOTMART_SUBSCRIPTION_CANCELLATION');

-- CreateEnum
CREATE TYPE "public"."WebhookStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'IGNORED');

-- CreateTable
CREATE TABLE "public"."webhook_logs" (
    "id" SERIAL NOT NULL,
    "integration_id" INTEGER,
    "platform" "public"."IntegrationPlatform" NOT NULL,
    "event_type" "public"."WebhookEventType" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "public"."WebhookStatus" NOT NULL,
    "error_message" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id")
);
