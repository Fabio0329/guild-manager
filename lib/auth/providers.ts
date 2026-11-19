// The sign-in providers, by the IDs configured in server/auth/config.ts,
// with their display names. Shared by the sign-in, connect, and disconnect
// buttons.
export const providerNames = {
  battlenet: "Battle.net",
  discord: "Discord",
} as const;

export type ProviderId = keyof typeof providerNames;

export const providerIds = Object.keys(providerNames) as ProviderId[];

// Account rows store the provider ID as plain text.
export const isProviderId = (value: string): value is ProviderId => {
  return value in providerNames;
};
