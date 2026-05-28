import { Language } from "@/contexts/LanguageContext";

export function getLocalizedPath(path: string, language: Language): string {
  // Remove any existing language prefix
  let cleanPath = path;
  if (path.startsWith("/en") || path.startsWith("/kr") || path.startsWith("/jp")) {
    cleanPath = path.substring(3);
  }
  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }

  // Add language prefix based on language
  if (language === "ko") {
    return `/kr${cleanPath}`;
  } else if (language === "ja") {
    return `/jp${cleanPath}`;
  } else {
    // English - use /en prefix or root
    return cleanPath === "/" ? "/" : `/en${cleanPath}`;
  }
}

export function removeLanguagePrefix(path: string): string {
  if (path.startsWith("/en") || path.startsWith("/kr") || path.startsWith("/jp")) {
    return path.substring(3) || "/";
  }
  return path;
}

export function getLanguageFromPath(path: string): Language {
  if (path.startsWith("/kr")) {
    return "ko";
  } else if (path.startsWith("/jp")) {
    return "ja";
  } else {
    return "en";
  }
}
