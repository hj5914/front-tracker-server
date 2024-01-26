export class TrackerDto {
  project: string;
  time: string;
  url: string;
  type: string;

  source: string;
  tagName: string;

  targetKey: string;

  message: string;
  filename: string;
  colno: number;
  lineno: number;

  status: number;
  timeout: number;
  responseText: string;
  method: string;
  requestUrl: string;
  timeStampCompute?: number;
}
