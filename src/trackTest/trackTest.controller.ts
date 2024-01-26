import { Controller, Get, HttpException, Query } from '@nestjs/common';

@Controller('trackTest')
export class TrackTestController {
  @Get('getSuccess')
  getSuccess(@Query() params: Record<string, any>) {
    return params;
  }

  @Get('getError')
  getError() {
    throw new HttpException('error message', 500);
  }

  @Get('getTimeout')
  getTimeout(@Query() params: { timeout: string }) {
    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve(params);
        },
        parseInt(params.timeout) || 5000,
      );
    });
  }
}
