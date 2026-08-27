import { ApiProperty } from '@nestjs/swagger';
import { SentimentEnum } from 'src/task/domain/task';

export class LastWeekProjectDetailsDto {
  @ApiProperty({ example: 12.5 })
  Monday: number;

  @ApiProperty({ example: 8.2 })
  Tuesday: number;

  @ApiProperty({ example: 14.1 })
  Wednesday: number;

  @ApiProperty({ example: 9.4 })
  Thursday: number;

  @ApiProperty({ example: 16.8 })
  Friday: number;

  @ApiProperty({ example: 22.3 })
  Saturday: number;

  @ApiProperty({ example: 18.7 })
  Sunday: number;
}

export class TopProjectDto {
  @ApiProperty({ example: '665f1c2a9c8f1a0012ab34cd' })
  id: string;

  @ApiProperty({ example: 'Why the Rich Think Differently', nullable: true })
  title: string | null;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
  url: string;

  @ApiProperty({
    example: 84.5,
    description: 'Predicted watch time in minutes',
  })
  predictedWatchTime: number;
}

export class DashboardMetricsDto {
  @ApiProperty({ example: 12 })
  totalProjects: number;

  @ApiProperty({
    example: 42.3,
    description: 'Average predicted watch time across podcasts, in minutes',
  })
  avgWatchTime: number;

  @ApiProperty({ example: 48 })
  adPlacements: number;

  @ApiProperty({
    enum: SentimentEnum,
    enumName: 'SentimentEnum',
    nullable: true,
    example: SentimentEnum.POSITIVE,
    description:
      'Majority sentiment across the latest analysis of each podcast',
  })
  overallSentiment: SentimentEnum | null;

  @ApiProperty({ example: 68 })
  hostPopularity: number;

  @ApiProperty({ example: 42 })
  guestPopularity: number;

  @ApiProperty({ type: LastWeekProjectDetailsDto })
  lastWeekProjectDetails: LastWeekProjectDetailsDto;

  @ApiProperty({ type: [TopProjectDto] })
  top3Projects: TopProjectDto[];
}
