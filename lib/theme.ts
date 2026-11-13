export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

// Runs as an inline <head> script, before the page is painted, so the first
// frame is already in the right theme (no light flash for dark-mode users).
// A stored choice wins; otherwise follow the OS setting. It's a string
// because it must run before React (or any bundle) has loaded.
export const themeScript = `(function(){var t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)})()`;
