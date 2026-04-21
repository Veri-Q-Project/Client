import { getUploadTimeoutMs } from '@/shared/api/apiConfig';
import { axiosBe1 } from '@/shared/api/axios';
import { apiEndpoints } from '@/shared/api/endpoints';
import type { BackendScanResponse } from '@/shared/api/types';

type SubmitQrImagePayload = {
  file: Blob;
  fileName?: string;
};

function resolveUploadFile({ file, fileName }: SubmitQrImagePayload): File {
  if (file instanceof File) {
    return file;
  }

  return new File([file], fileName ?? `qr-scan-${Date.now()}.jpg`, {
    type: file.type || 'image/jpeg',
  });
}

export async function submitQrImage(payload: SubmitQrImagePayload): Promise<BackendScanResponse> {
  const uploadFile = resolveUploadFile(payload);
  const formData = new FormData();

  formData.append('image', uploadFile, uploadFile.name);

  const response = await axiosBe1.post<BackendScanResponse>(apiEndpoints.scan, formData, {
    timeout: getUploadTimeoutMs(),
  });

  return response.data;
}
