import refresh from "../../utils/refresh.js";

class MyAxios {
    constructor() {
        this.defaultHeaders = {
            'Content-Type' : 'application/json',
        };
        this.interceptors = {
          request: [],
          response: [],
      };
    }
    addInterceptor(type, fulfilled, rejected) {
      if (type === 'request') {
          this.interceptors.request.push({ fulfilled, rejected });
      } else if (type === 'response') {
          this.interceptors.response.push({ fulfilled, rejected });
      }
  }
    async request(options) {
      let config = {
        ...options,
        headers : {...this.defaultHeaders, ...options.headers}
      }
      for (const interceptor of this.interceptors.request) {
        try {
            config = await interceptor.fulfilled(config);
        } catch (error) {
            if (interceptor.rejected) {
                return interceptor.rejected(error);
            }
            return Promise.reject(error);
        }
    }
        const {
          url,
          method = 'GET',
          params = {},
          data = null,
          responseType = 'json',
          credentials = 'include', // 원래 axios에서는 기본값이 same-origin이지만, myaxios에서는 편의를 위해 include로 구현함
        } = options;
   
        
        let queryString = '';
        if (Object.keys(params).length > 0) {
          queryString = '?' + new URLSearchParams(params).toString();
        }
        const fullUrl = url + queryString;
    
        
        if (data instanceof FormData) {
            delete config.headers['Content-Type']; // FormData일 때는 Content-Type 제거
        }
    
        const fetchOptions = {
          method,
          headers: config.headers,
          credentials,
        };
    
        if (method !== 'GET' ) {
            fetchOptions.body = data instanceof FormData ? data : JSON.stringify(data);
        }
    
        // 비동기 요청 시작
        try {
          const response = await fetch(fullUrl, fetchOptions);

          // 응답 인터셉터
          let modifiedResponse = await this._handleResponse(response, responseType, config);
            for (const interceptor of this.interceptors.response) {
                try {
                    modifiedResponse = await interceptor.fulfilled(modifiedResponse);
                } catch (error) {
                    if (interceptor.rejected) {
                        return interceptor.rejected(error);
                    }
                    return Promise.reject(error);
                }
            }
          return modifiedResponse;
        } catch (error) {
          for (const interceptor of this.interceptors.response) {
              if (interceptor.rejected) {
                  return interceptor.rejected(error);
              }
          }
          return Promise.reject(error);
        }
      }

      async _handleResponse(response, responseType, config) {
        const parseResponse = {
          json: () => response.json(),
          text: () => response.text(),
          blob: () => response.blob(),
          arrayBuffer: () => response.arrayBuffer(),
        };
    
        if (!response.ok) {
          const data = await parseResponse[responseType]();
          return Promise.reject({
            status: response.status,
            statusText: response.statusText,
            data,
            config
          });
        }
    
        const data = await parseResponse[responseType]();
        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config : config,
        };
      }
    get(url, config = {}) {
        return this.request({...config, url, method:'GET'});
    }
    post(url, data = {}, config = {}) {
        return this.request({...config, url, method : 'POST', data});
    }
    put(url, data = {}, config = {}) {
        return this.request({...config, url, method : 'PUT', data});
    }
    delete(url, data = {}, config = {}) {
        return this.request({...config, url, method : 'DELETE', data});
    }
}

const myAxios = new MyAxios();


myAxios.addInterceptor('response',
  (response) => {
      return response},
  async (error) => {
      const originalRequest = error.config;
      if (error.status === 401 && !originalRequest._retry && !originalRequest.skipAuthRefresh) {
          originalRequest._retry = true;
          const refreshSuccess = await refresh();
          if (refreshSuccess) {
              return myAxios.request(originalRequest);
          }
      }
      return Promise.reject(error);
  }
)

export default myAxios;