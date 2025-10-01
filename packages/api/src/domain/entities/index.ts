export * from '@synapse/shared-types';
export interface DomainEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletableEntity extends DomainEntity {
  deletedAt?: Date;
}
export class EmailValueObject {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }
  }

  getValue(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Domain Events
export interface DomainEvent {
  occurredOn: Date;
  eventType: string;
  aggregateId: number;
}

export class UserCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventType = 'USER_CREATED';

  constructor(public readonly aggregateId: number) {
    this.occurredOn = new Date();
  }
}

export class ProductCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventType = 'PRODUCT_CREATED';

  constructor(
    public readonly aggregateId: number,
    public readonly userId: number,
  ) {
    this.occurredOn = new Date();
  }
}
