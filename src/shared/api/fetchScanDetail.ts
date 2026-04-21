import { axiosBe3 } from '@/shared/api/axios';
import { apiEndpoints } from '@/shared/api/endpoints';
import type { BackendAnalysisDetailResponse } from '@/shared/api/types';

export async function fetchScanDetail(url: string): Promise<BackendAnalysisDetailResponse> {
  const response = await axiosBe3.get<BackendAnalysisDetailResponse>(apiEndpoints.scanDetail, {
    params: {
      url,
    },
  });

  return response.data;
}
