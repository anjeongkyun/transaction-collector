import axios, { AxiosInstance, AxiosError } from "axios";

class AxiosRetry {
  static retryAxios(
    tryCount: number,
    timeInterval: number,
    baseUrl: string
  ): AxiosInstance {
    const instance = axios.create({
      responseType: "json",
      headers: {
        "content-type": "application/json",
      },
      baseURL: baseUrl,
    });

    const onFulfilled = (response: any) => response;

    const onRejected = (error: AxiosError) => {
      if (!error.config) {
        return Promise.reject(error);
      }

      if (error.response && error.response.status === 429) {
        return Promise.reject(error);
      }

      if (tryCount <= 0) {
        return Promise.reject(error);
      }

      tryCount--;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            instance[error.config?.method?.toLowerCase()](error.config.url)
          );
        }, timeInterval);
      });
    };

    instance.interceptors.response.use(onFulfilled, onRejected);
    return instance;
  }
}

export default AxiosRetry;
