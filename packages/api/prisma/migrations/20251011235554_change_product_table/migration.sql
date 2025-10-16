-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "category" VARCHAR(100),
ADD COLUMN     "currency" VARCHAR(3) DEFAULT 'BRL',
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'active';
