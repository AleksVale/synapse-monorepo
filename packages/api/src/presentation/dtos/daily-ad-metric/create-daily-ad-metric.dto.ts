import type { CreateDailyAdMetricDto as ICreateDailyAdMetricDto } from '@synapse/shared-types';
import { IsDate, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDailyAdMetricDto implements ICreateDailyAdMetricDto {
  @IsOptional()
  @IsInt({ message: 'Campaign ID must be an integer' })
  campaignId?: number;

  @IsDate({ message: 'Date must be a valid date' })
  date: Date;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Spend must be a valid number with up to 2 decimal places' },
  )
  @Min(0, { message: 'Spend must be at least 0' })
  spend: number;

  @IsInt({ message: 'Clicks must be an integer' })
  @Min(0, { message: 'Clicks must be at least 0' })
  clicks: number;

  @IsInt({ message: 'Impressions must be an integer' })
  @Min(0, { message: 'Impressions must be at least 0' })
  impressions: number;

  @IsInt({ message: 'Conversions must be an integer' })
  @Min(0, { message: 'Conversions must be at least 0' })
  conversions: number;

  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  userId?: number;
}
