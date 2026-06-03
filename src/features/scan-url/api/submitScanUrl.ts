import { getUploadTimeoutMs } from '@/shared/api/apiConfig';
import { axiosBe3 } from '@/shared/api/axios';
import { apiEndpoints } from '@/shared/api/endpoints';
import type { BackendScanResponse } from '@/shared/api/types';

type SubmitScanUrlPayload = {
  url: string;
};

export async function submitScanUrl({ url }: SubmitScanUrlPayload): Promise<BackendScanResponse> {
  const response = await axiosBe3.get<BackendScanResponse>(apiEndpoints.scanText, {
    params: {
      url,
    },
    timeout: getUploadTimeoutMs(),
  });

  return response.data;
}
