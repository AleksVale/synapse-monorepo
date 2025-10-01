import type { UpdateDailyAdMetricDto as IUpdateDailyAdMetricDto } from '@synapse/shared-types';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateDailyAdMetricDto implements IUpdateDailyAdMetricDto {
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Spend must be a valid number with up to 2 decimal places' },
  )
  @Min(0, { message: 'Spend must be at least 0' })
  spend?: number;

  @IsOptional()
  @IsInt({ message: 'Clicks must be an integer' })
  @Min(0, { message: 'Clicks must be at least 0' })
  clicks?: number;

  @IsOptional()
  @IsInt({ message: 'Impressions must be an integer' })
  @Min(0, { message: 'Impressions must be at least 0' })
  impressions?: number;

  @IsOptional()
  @IsInt({ message: 'Conversions must be an integer' })
  @Min(0, { message: 'Conversions must be at least 0' })
  conversions?: number;
}
