import * as url from 'url';

export const environment = {
  production: false,
  api: (path: string, query?: {}) => {
    return url.format({
      protocol: 'http',
      hostname: 'in-memory.dev',
      pathname: `v1/${path}`,
      query,
    });
  }
};
