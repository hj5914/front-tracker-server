import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  Param,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { TrackerDto } from './tracker.dto';
import DataBase from '@/DataBase';

@Controller('tracker')
export class TrackerController {
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  tracker(@Body() body: TrackerDto) {
    DataBase().addData(body);
  }

  @Get('getProjectList')
  getProjectList() {
    return DataBase().getProjectList();
  }

  @Get('getJsError/:projectId')
  getJsError(@Param('projectId') projectId: string) {
    return { data: DataBase().getJsError(projectId) };
  }

  @Get('getSourceError/:projectId')
  getSourceError(@Param('projectId') projectId: string) {
    return { data: DataBase().getSourceError(projectId) };
  }

  @Get('getHistoryData/:projectId')
  getHistoryData(@Param('projectId') projectId: string) {
    return { data: DataBase().getHistoryData(projectId) };
  }

  @Get('getHashData/:projectId')
  getHashData(@Param('projectId') projectId: string) {
    return { data: DataBase().getHashData(projectId) };
  }

  @Get('getDomData/:projectId')
  getDomData(@Param('projectId') projectId: string) {
    return { data: DataBase().getDomData(projectId) };
  }

  @Get('getAjaxData/:projectId')
  getAjaxData(@Param('projectId') projectId: string) {
    return { data: DataBase().getAjaxData(projectId) };
  }
}
