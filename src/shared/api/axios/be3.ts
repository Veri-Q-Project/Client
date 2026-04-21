import { getApiTimeoutMs, getBe3BaseUrl } from '@/shared/api/apiConfig';

import { createAxios } from './createAxios';

export const axiosBe3 = createAxios({
  baseURL: getBe3BaseUrl(),
  timeout: getApiTimeoutMs(),
});
