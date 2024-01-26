import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerModule } from './tracker/tracker.module';
import { TrackTestModule } from './trackTest/trackTest.module';

@Module({
  imports: [TrackerModule, TrackTestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
