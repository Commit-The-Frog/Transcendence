class MyAxios {
    constructor() {
        this.defaultHeaders = {
            'Content-Type' : 'application/json',
        };
    }
    async request(options) {
        const {
          url,
          method = 'GET',
          headers = {},
          params = {},
          data = null,
          timeout = 0,
          responseType = 'json',
          credentials = 'include', // 원래 axios에서는 기본값이 same-origin이지만, myaxios에서는 편의를 위해 include로 구현함
        } = options;
    
        let queryString = '';
        if (Object.keys(params).length > 0) {
          queryString = '?' + new URLSearchParams(params).toString();
        }
        const fullUrl = url + queryString;
    
        const combineHeaders = { ...this.defaultHeaders, ...headers };
        
        if (data instanceof FormData) {
            delete combineHeaders['Content-Type']; // FormData일 때는 Content-Type 제거
        }
    
        const fetchOptions = {
          method,
          headers: combineHeaders,
          credentials,
        };
    
        if (method !== 'GET' && method !== 'DELETE') {
            fetchOptions.body = data instanceof FormData ? data : JSON.stringify(data);
        }
    
        // 비동기 요청 시작
        try {
          const response = await fetch(fullUrl, fetchOptions);
          return this._handleResponse(response, responseType);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      async _handleResponse(response, responseType) {
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
          });
        }
    
        const data = await parseResponse[responseType]();
        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
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
    delete(url, config = {}) {
        return this.request({...config, url, method : 'DELETE'});
    }
}

export default new MyAxios();