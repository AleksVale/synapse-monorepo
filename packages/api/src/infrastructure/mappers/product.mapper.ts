import type { Product } from '@synapse/shared-types';
import type { Product as PrismaProduct } from 'generated/prisma';

export class ProductMapper {
  static toDomain(prismaProduct: PrismaProduct): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description ?? undefined,
      userId: prismaProduct.userId ?? undefined,
      price: prismaProduct.price
        ? this.decimalToNumber(prismaProduct.price)
        : undefined,
      currency: prismaProduct.currency ?? undefined,
      category: prismaProduct.category ?? undefined,
      status: prismaProduct.status,
      metadata:
        (prismaProduct.metadata as Record<string, unknown>) ?? undefined,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
      deletedAt: prismaProduct.deletedAt ?? undefined,
    };
  }

  static toDomainList(prismaProducts: PrismaProduct[]): Product[] {
    return prismaProducts.map((product) => this.toDomain(product));
  }

  private static decimalToNumber(decimal: unknown): number {
    if (typeof decimal === 'number') return decimal;
    if (typeof decimal === 'string') return parseFloat(decimal);
    if (decimal && typeof decimal === 'object' && 'toString' in decimal) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return parseFloat(decimal.toString());
    }
    return 0;
  }
}
