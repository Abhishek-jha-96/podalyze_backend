import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { DashboardMetricsDto } from './dto/dashboard-metrics.dto';
import { GetUser } from 'src/utils/get-user.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Dashboard')
@Controller({
  path: 'dashboard',
  version: '1',
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get cached dashboard metrics for the authenticated user',
  })
  @ApiOkResponse({ type: DashboardMetricsDto })
  getDashboard(@GetUser('id') userId: string): Promise<DashboardMetricsDto> {
    return this.dashboardService.getDashboard({ id: userId });
  }
}
