import * as url from 'url';

export const environment = {
  production: true,
  api: (path: string, query?: {}) => {
    return url.format({
      protocol: 'https',
      hostname: 'in-memory.dev',
      pathname: `v1/${path}`,
      query,
    });
  }
};
