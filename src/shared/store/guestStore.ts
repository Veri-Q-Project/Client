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

  return `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
