import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const guestUuidStorageKey = 'veriq.guestUuid';

type GuestStoreState = {
  ensureGuestUuid: () => string;
  guestUuid: string | null;
  setGuestUuid: (guestUuid: string) => void;
};

function createGuestUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
      16,
      20,
    )}-${hex.slice(20)}`;
  }

  throw new Error('Secure random UUID generation is not supported in this environment.');
}

export function readGuestUuidFromStorage(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(guestUuidStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as {
      guestUuid?: unknown;
      state?: {
        guestUuid?: unknown;
      };
    };
    const candidateValue =
      typeof parsedValue?.state?.guestUuid === 'string'
        ? parsedValue.state.guestUuid
        : parsedValue?.guestUuid;

    if (typeof candidateValue === 'string' && candidateValue.trim().length > 0) {
      return candidateValue.trim();
    }
  } catch {
    const trimmedValue = rawValue.trim();

    if (trimmedValue.length > 0) {
      return trimmedValue;
    }
  }

  return null;
}

export const useGuestStore = create<GuestStoreState>()(
  persist(
    (set, get) => ({
      ensureGuestUuid: () => {
        const persistedGuestUuid = readGuestUuidFromStorage();

        if (persistedGuestUuid) {
          if (get().guestUuid !== persistedGuestUuid) {
            set({ guestUuid: persistedGuestUuid });
          }

          return persistedGuestUuid;
        }

        const nextGuestUuid = createGuestUuid();
        set({ guestUuid: nextGuestUuid });
        return nextGuestUuid;
      },
      guestUuid: null,
      setGuestUuid: (guestUuid) => {
        set({ guestUuid });
      },
    }),
    {
      name: guestUuidStorageKey,
      partialize: (state) => ({
        guestUuid: state.guestUuid,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
