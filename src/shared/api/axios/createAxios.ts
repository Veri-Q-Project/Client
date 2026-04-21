import axios from 'axios';

import { toApiError } from '@/shared/api/errors/apiError';
import { readGuestUuidFromStorage } from '@/shared/store/guestStore';

type CreateAxiosOptions = {
  baseURL: string;
  timeout: number;
};

export function createAxios({ baseURL, timeout }: CreateAxiosOptions) {
  const instance = axios.create({
    baseURL: baseURL || undefined,
    timeout,
  });

  instance.interceptors.request.use((config) => {
    const guestUuid = readGuestUuidFromStorage();

    if (guestUuid) {
      config.headers.set('guest_uuid', guestUuid);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      throw toApiError(error);
    },
  );

  return instance;
}
