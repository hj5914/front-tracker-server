import * as dayjs from 'dayjs';
import { TrackerDto } from './tracker/tracker.dto';

type SendErrorBaseType = {
  time: string;
  url: string;
  project: string;
};
type SourceErrorType = {
  type: 'sourceError';
  source: string;
  tagName: string;
};
type JsErrorType = {
  type: 'jsError';
  message: string;
  filename: string;
  colno: string;
  lineno: string;
};
type HistoryTrackerType = {
  type: 'history.pushState' | 'history.replaceState';
};
type HashTrackerType = {
  type: 'hashchange';
  oldURL: string;
};
type DomTrackerType = {
  type: 'dom.click';
  targetKey: string;
};
type AjaxTrackerType = {
  type: 'ajaxTracker';
  status: string;
  timeout: string;
  responseText: string;
  method?: string;
  requestUrl?: string;
  timeStampCompute?: string;
};
type CustomDataType = {
  type: string;
  [key: string]: any;
};

type dataType = {
  [projectId: string]: {
    [dateStr: string]: Record<string, any>;
  };
};

type RecordType<T = any> = Map<string, T>;
class DataBase {
  public data: dataType = {};
  public addData(data: TrackerDto) {
    const { project: projectId } = data;
    this.data[projectId] ??= {};

    const { time } = data;
    const dateStr = dayjs(parseInt(time)).format('YYYY-MM-DD');
    this.data[projectId][dateStr] ??= {};

    const { type } = data;
    this.data[projectId][dateStr][type] ??= new Map();

    const typeData = this.data[projectId][dateStr][type];

    switch (type) {
      case 'sourceError': {
        this.setSourceErrorData.call(typeData, data);
        return;
      }
      case 'history.pushState': {
        this.setHistoryData.call(typeData, data);
        return;
      }
      case 'history.replaceState': {
        this.setHistoryData.call(typeData, data);
        return;
      }
      case 'hashchange': {
        this.setHashData.call(typeData, data);
        return;
      }
      case 'jsError': {
        this.setJsErrorData.call(typeData, data);
        return;
      }
      case 'dom.click': {
        this.setDomTrackerData.call(typeData, data);
        return;
      }
      case 'ajaxTracker': {
        this.setAjaxTrackerData.call(typeData, data);
        return;
      }
      default: {
        this.setCustomTrackerData.call(typeData, data);
      }
    }
  }
  private setSourceErrorData<T extends SourceErrorType & SendErrorBaseType>(
    this: RecordType<Pick<T, 'source' | 'url' | 'tagName'> & { times: number }>,
    data: T,
  ) {
    const { source, tagName, url } = data;
    const key = source + tagName;
    if (this.has(key)) {
      const res = this.get(key);
      res.times++;
      this.set(key, res);
    } else {
      this.set(key, { source, tagName, url, times: 1 });
    }
  }
  private setHistoryData<T extends HistoryTrackerType & SendErrorBaseType>(
    this: RecordType<Pick<T, 'url'> & { times: number }>,
    data: T,
  ) {
    const { url } = data;
    if (this.has(url)) {
      const res = this.get(url);
      res.times++;
      this.set(url, res);
    } else {
      this.set(url, { url, times: 1 });
    }
  }
  private setHashData<T extends HashTrackerType & SendErrorBaseType>(
    this: RecordType<Pick<T, 'url'> & { times: number }>,
    data: T,
  ) {
    const { url } = data;
    if (this.has(url)) {
      const res = this.get(url);
      res.times++;
      this.set(url, res);
    } else {
      this.set(url, { url, times: 1 });
    }
  }
  private setJsErrorData<T extends JsErrorType & SendErrorBaseType>(
    this: RecordType<
      Pick<T, 'lineno' | 'colno' | 'filename' | 'message'> & { times: number }
    >,
    data: T,
  ) {
    const { colno, lineno, filename, message } = data;
    const key = `${filename}&${colno}&${lineno}`;
    if (this.has(key)) {
      const res = this.get(key);
      res.times++;
      this.set(key, res);
    } else {
      this.set(key, { colno, lineno, filename, message, times: 1 });
    }
  }
  private setDomTrackerData<T extends DomTrackerType & SendErrorBaseType>(
    this: RecordType<Pick<T, 'targetKey'> & { times: number }>,
    data: T,
  ) {
    const { targetKey } = data;
    if (this.has(targetKey)) {
      const res = this.get(targetKey);
      res.times++;
      this.set(targetKey, res);
    } else {
      this.set(targetKey, { targetKey, times: 1 });
    }
  }
  private setAjaxTrackerData<T extends AjaxTrackerType & SendErrorBaseType>(
    this: Map<
      'error' | 'success',
      RecordType<
        Pick<T, 'requestUrl' | 'method' | 'timeStampCompute' | 'timeout'> & {
          times: number;
          responseText?: string;
        }
      >
    >,
    data: T,
  ) {
    const {
      status,
      timeout,
      responseText,
      method,
      requestUrl,
      timeStampCompute,
    } = data;
    if (!this.has('success')) this.set('success', new Map());
    if (!this.has('error')) this.set('error', new Map());
    if (status === '200') {
      const key = `${requestUrl}&${method}`;
      const successMap = this.get('success');
      if (successMap.has(key)) {
        const res = successMap.get(key);
        const newTimeCompute: number =
          (res.times * parseFloat(res.timeStampCompute) +
            parseFloat(timeStampCompute)) /
          (res.times + 1);
        res.timeStampCompute = newTimeCompute + '';
        res.times++;
        successMap.set(key, res);
      } else {
        successMap.set(key, {
          requestUrl,
          method,
          timeStampCompute,
          timeout,
          times: 1,
        });
      }
    } else {
      const errorMap = this.get('error');
      const key = errorMap.size + 1 + '';
      errorMap.set(key, {
        requestUrl,
        method,
        timeStampCompute,
        timeout,
        times: 1,
        responseText,
      });
    }
  }
  private setCustomTrackerData<T extends CustomDataType & SendErrorBaseType>(
    this: RecordType<T>,
    data: T,
  ) {
    const key = this.size + 1 + '';
    this.set(key, data);
  }

  public getProjectList() {
    return Object.keys(this.data);
  }
  public getJsError(projectId: string) {
    const jsErrorMap: Map<string, any> =
      this.data[projectId]?.[dayjs().format('YYYY-MM-DD')]?.['jsError'] ||
      new Map();
    return Array.from(jsErrorMap.values());
  }
  public getSourceError(projectId: string) {
    const sourceErrorMap: Map<string, any> =
      this.data[projectId]?.[dayjs().format('YYYY-MM-DD')]?.['sourceError'] ||
      new Map();
    return Array.from(sourceErrorMap.values());
  }
  public getHistoryData(projectId: string) {
    const historyPushMap: Map<string, any> =
      this.data[projectId]?.[dayjs().format('YYYY-MM-DD')]?.[
        'history.pushState'
      ] || new Map();
    const historyReplaceMap: Map<string, any> =
      this.data[projectId]?.[dayjs().format('YYYY-MM-DD')]?.[
        'history.replaceState'
      ] || new Map();
    return {
      push: Array.from(historyPushMap.values()),
      replace: Array.from(historyReplaceMap.values()),
    };
  }
  public getHashData(projectId: string) {
    const mapData: Map<string, any> =
      this.data[projectId]?.[dayjs().format('YYYY-MM-DD')]?.['hashchange'] ||
      new Map();
    return Array.from(mapData.values());
  }
  public getDomData(projectId: string) {
    const mapData: Map<string, any> =
      this.data[projectId]?.[dayjs().format('YYYY-MM-DD')]?.['dom.click'] ||
      new Map();
    return Array.from(mapData.values());
  }
  public getAjaxData(projectId: string) {
    const mapData: Map<string, any> =
      this.data[projectId]?.[dayjs().format('YYYY-MM-DD')]?.['ajaxTracker'] ||
      new Map();
    const successMap = mapData.get('success') || new Map();
    const errorMap = mapData.get('error') || new Map();
    return {
      success: Array.from(successMap.values()),
      error: Array.from(errorMap.values()),
    };
  }
}

export default (function () {
  let instance: null | DataBase = null;
  return function () {
    if (!instance) instance = new DataBase();
    return instance;
  };
})();
