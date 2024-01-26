import { Module } from '@nestjs/common';
import { TrackerController } from './tracker.controller';

@Module({
  controllers: [TrackerController],
  providers: [],
})
export class TrackerModule {}
