import { getApiTimeoutMs, getBe1BaseUrl } from '@/shared/api/apiConfig';

import { createAxios } from './createAxios';

export const axiosBe1 = createAxios({
  baseURL: getBe1BaseUrl(),
  timeout: getApiTimeoutMs(),
});
