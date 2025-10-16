import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import type {
  ApiResponse,
  Integration,
  ListIntegrationsResponseDto,
} from '@synapse/shared-types';
import {
  CreateIntegrationUseCase,
  DeleteIntegrationUseCase,
  ListUserIntegrationsUseCase,
  UpdateIntegrationUseCase,
} from '../../application/use-cases';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dtos';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
    name: string;
  };
}

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationController {
  constructor(
    private readonly createIntegrationUseCase: CreateIntegrationUseCase,
    private readonly listUserIntegrationsUseCase: ListUserIntegrationsUseCase,
    private readonly updateIntegrationUseCase: UpdateIntegrationUseCase,
    private readonly deleteIntegrationUseCase: DeleteIntegrationUseCase,
  ) {}

  @Get()
  async listIntegrations(
    @Request() req: AuthenticatedRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ListIntegrationsResponseDto> {
    return this.listUserIntegrationsUseCase.execute(
      req.user.userId,
      Number(page),
      Number(limit),
    );
  }

  @Post()
  async createIntegration(
    @Request() req: AuthenticatedRequest,
    @Body() createIntegrationDto: CreateIntegrationDto,
  ): Promise<ApiResponse<Integration | null>> {
    try {
      const integration = await this.createIntegrationUseCase.execute(
        req.user.userId,
        createIntegrationDto,
      );

      return {
        success: true,
        data: integration,
        message: 'Integration created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create integration',
      };
    }
  }

  @Put(':id')
  async updateIntegration(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIntegrationDto: UpdateIntegrationDto,
  ): Promise<ApiResponse<Integration>> {
    try {
      const integration = await this.updateIntegrationUseCase.execute(
        id,
        req.user.userId,
        updateIntegrationDto,
      );

      return {
        success: true,
        data: integration,
        message: 'Integration updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to update integration',
      };
    }
  }

  @Delete(':id')
  async deleteIntegration(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    try {
      await this.deleteIntegrationUseCase.execute(id, req.user.userId);

      return {
        success: true,
        data: null,
        message: 'Integration deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to delete integration',
      };
    }
  }
}
