/**
 * Every public route the page tests visit. Listed explicitly: most of this
 * app will sit behind sign-in, so there's no public sitemap to read routes
 * from. Add each new public route here. The missing page covers the 404.
 */
export const publicRoutes = ["/", "/sign-in", "/this-page-does-not-exist"];

/** Pages that need a signed-in user; also listed in proxy.ts. */
export const protectedRoutes = ["/account"];

/** Public pages that send a signed-in visitor elsewhere. */
export const signedOutOnlyRoutes = ["/sign-in"];

/** Every page a signed-in visitor can actually see. */
export const signedInRoutes = [...publicRoutes, ...protectedRoutes].filter(
  (route) => !signedOutOnlyRoutes.includes(route),
);
