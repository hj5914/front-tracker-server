import { Module } from '@nestjs/common';
import { TrackTestController } from './trackTest.controller';

@Module({
  controllers: [TrackTestController],
  providers: [],
})
export class TrackTestModule {}
