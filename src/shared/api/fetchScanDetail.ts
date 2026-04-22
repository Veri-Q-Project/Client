import { axiosBe3 } from '@/shared/api/axios';
import { apiEndpoints } from '@/shared/api/endpoints';
import { ApiError, toApiError } from '@/shared/api/errors/apiError';
import type { BackendAnalysisDetailResponse } from '@/shared/api/types';

const MAX_SCAN_DETAIL_QUERY_URL_LENGTH = 2_000;

export async function fetchScanDetail(url: string): Promise<BackendAnalysisDetailResponse> {
  if (url.length > MAX_SCAN_DETAIL_QUERY_URL_LENGTH) {
    throw new ApiError({
      message: 'Scan detail URL is too long to request safely.',
    });
  }

  try {
    const response = await axiosBe3.get<BackendAnalysisDetailResponse>(apiEndpoints.scanDetail, {
      params: {
        url,
      },
    });

    return response.data;
  } catch (error) {
    const apiError = toApiError(error);

    throw new ApiError({
      code: apiError.code,
      message: apiError.message,
      statusCode: apiError.statusCode,
    });
  }
}
