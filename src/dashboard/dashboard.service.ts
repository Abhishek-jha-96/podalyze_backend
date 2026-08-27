import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/configs/config.types';
import { ProjectRepository } from 'src/project/entities/project.repository';
import { SentimentEnum, Task } from 'src/task/domain/task';
import { User } from 'src/user/domain/user';
import {
  DashboardMetricsDto,
  LastWeekProjectDetailsDto,
  TopProjectDto,
} from './dto/dashboard-metrics.dto';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

type Weekday = (typeof WEEKDAYS)[number];

const SENTIMENT_TIE_ORDER: SentimentEnum[] = [
  SentimentEnum.POSITIVE,
  SentimentEnum.NEUTRAL,
  SentimentEnum.NEGATIVE,
];

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly projectRepository: ProjectRepository,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async getDashboard(user: Pick<User, 'id'>): Promise<DashboardMetricsDto> {
    const userId = user.id;
    const key = `dashboard:${userId}`;

    try {
      const cached = await this.cache.get<DashboardMetricsDto>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(`Redis cache read failed for ${key}: ${error}`);
    }

    const metrics = await this.calculateDashboard(userId);
    const ttlMs = this.configService.get('redis', { infer: true })?.ttlMs;

    try {
      await this.cache.set(key, metrics, ttlMs);
    } catch (error) {
      this.logger.warn(`Redis cache write failed for ${key}: ${error}`);
    }

    return metrics;
  }

  async calculateDashboard(userId: string): Promise<DashboardMetricsDto> {
    const projects = await this.projectRepository.findAllByCreatedBy({
      createdBy: userId,
    });

    const emptyWeek = this.emptyWeek();

    if (!projects.length) {
      return {
        totalProjects: 0,
        avgWatchTime: 0,
        adPlacements: 0,
        overallSentiment: null,
        hostPopularity: 0,
        guestPopularity: 0,
        lastWeekProjectDetails: emptyWeek,
        top3Projects: [],
      };
    }

    const rows = projects.map((project) => {
      const latestTask = this.getLatestTask(project.tasks);
      return {
        id: project.id,
        title: project.title,
        url: project.url,
        createdAt: project.createdAt,
        hostPopularity: project.hostPopularity,
        guestPopularity: project.guestPopularity,
        numberOfAds: project.numberOfAds ?? 0,
        watchTime: latestTask?.watchTime,
        sentiment: latestTask?.sentiment,
      };
    });

    const watchTimes = rows
      .map((row) => row.watchTime)
      .filter((value): value is number => typeof value === 'number');

    const hostScores = rows
      .map((row) => row.hostPopularity)
      .filter((value): value is number => typeof value === 'number');

    const guestScores = rows
      .map((row) => row.guestPopularity)
      .filter((value): value is number => typeof value === 'number');

    const sentiments = rows
      .map((row) => row.sentiment)
      .filter((value): value is SentimentEnum => Boolean(value));

    return {
      totalProjects: rows.length,
      avgWatchTime: this.average(watchTimes),
      adPlacements: rows.reduce((sum, row) => sum + (row.numberOfAds || 0), 0),
      overallSentiment: this.majoritySentiment(sentiments),
      hostPopularity: this.average(hostScores),
      guestPopularity: this.average(guestScores),
      lastWeekProjectDetails: this.lastWeekAverages(rows),
      top3Projects: this.topPerformers(rows),
    };
  }

  private getLatestTask(tasks?: Task[]): Task | undefined {
    if (!tasks?.length) {
      return undefined;
    }

    return [...tasks].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];
  }

  private lastWeekAverages(
    rows: Array<{ createdAt: Date; watchTime?: number }>,
  ): LastWeekProjectDetailsDto {
    const weekStart = this.startOfUtcDay(new Date());
    weekStart.setUTCDate(weekStart.getUTCDate() - 6);

    const buckets: Record<Weekday, number[]> = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };

    for (const row of rows) {
      const createdAt = new Date(row.createdAt);
      if (Number.isNaN(createdAt.getTime()) || createdAt < weekStart) {
        continue;
      }
      if (typeof row.watchTime !== 'number') {
        continue;
      }

      const day = WEEKDAYS[createdAt.getUTCDay()];
      buckets[day].push(row.watchTime);
    }

    return {
      Monday: this.average(buckets.Monday),
      Tuesday: this.average(buckets.Tuesday),
      Wednesday: this.average(buckets.Wednesday),
      Thursday: this.average(buckets.Thursday),
      Friday: this.average(buckets.Friday),
      Saturday: this.average(buckets.Saturday),
      Sunday: this.average(buckets.Sunday),
    };
  }

  private topPerformers(
    rows: Array<{
      id: string;
      title: string | null;
      url: string;
      watchTime?: number;
    }>,
  ): TopProjectDto[] {
    return rows
      .filter(
        (row): row is typeof row & { watchTime: number } =>
          typeof row.watchTime === 'number',
      )
      .sort((a, b) => b.watchTime - a.watchTime)
      .slice(0, 3)
      .map((row) => ({
        id: row.id,
        title: row.title,
        url: row.url,
        predictedWatchTime: this.round(row.watchTime),
      }));
  }

  private majoritySentiment(sentiments: SentimentEnum[]): SentimentEnum | null {
    if (!sentiments.length) {
      return null;
    }

    const counts = new Map<SentimentEnum, number>();
    for (const sentiment of sentiments) {
      counts.set(sentiment, (counts.get(sentiment) ?? 0) + 1);
    }

    return [...counts.entries()].sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return (
        SENTIMENT_TIE_ORDER.indexOf(a[0]) - SENTIMENT_TIE_ORDER.indexOf(b[0])
      );
    })[0][0];
  }

  private emptyWeek(): LastWeekProjectDetailsDto {
    return {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };
  }

  private startOfUtcDay(date: Date): Date {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    return start;
  }

  private average(values: number[]): number {
    if (!values.length) {
      return 0;
    }
    return this.round(
      values.reduce((sum, value) => sum + value, 0) / values.length,
    );
  }

  private round(value: number, digits = 1): number {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }
}
