import { useEffect } from "react";
import { useLocation } from "wouter";

interface HreflangLink {
  lang: string;
  url: string;
}

export function useHreflang(hreflangLinks: HreflangLink[]) {
  const [location] = useLocation();

  useEffect(() => {
    // Remove existing hreflang tags
    const existingLinks = document.querySelectorAll('link[rel="alternate"]');
    existingLinks.forEach((link) => link.remove());

    // Add new hreflang tags
    hreflangLinks.forEach(({ lang, url }) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.setAttribute('hreflang', lang);
      link.href = url;
      document.head.appendChild(link);
    });

    // Add canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.remove();
    }
    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    canonicalLink.href = window.location.href;
    document.head.appendChild(canonicalLink);
  }, [location, hreflangLinks]);
}

export function getHreflangLinks(
  basePath: string,
  domain: string = window.location.origin
): HreflangLink[] {
  return [
    {
      lang: "en",
      url: `${domain}/en${basePath}`,
    },
    {
      lang: "ko",
      url: `${domain}/kr${basePath}`,
    },
    {
      lang: "ja",
      url: `${domain}/jp${basePath}`,
    },
    {
      lang: "x-default",
      url: `${domain}${basePath}`,
    },
  ];
}
