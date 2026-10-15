import { siteConfig } from '../config/site';

/**
 * Injects canonical, og:url, og:image, and twitter:card tags ONLY when siteConfig.siteUrl is non-empty.
 * With siteUrl empty, it adds nothing to the DOM.
 */
export function initSeoMetadata(): void {
  if (typeof document === 'undefined') return;

  const { siteUrl } = siteConfig;
  if (!siteUrl || !siteUrl.trim()) {
    // When siteUrl is empty, add nothing.
    return;
  }

  const cleanUrl = siteUrl.replace(/\/$/, '');

  // 1. Canonical link
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = cleanUrl;

  // 2. og:url
  let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.content = cleanUrl;

  // 3. og:image
  let ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
  if (!ogImage) {
    ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    document.head.appendChild(ogImage);
  }
  ogImage.content = `${cleanUrl}/og-image.jpg`;

  // 4. twitter:card
  let twitterCard = document.querySelector<HTMLMetaElement>('meta[name="twitter:card"]');
  if (!twitterCard) {
    twitterCard = document.createElement('meta');
    twitterCard.setAttribute('name', 'twitter:card');
    document.head.appendChild(twitterCard);
  }
  twitterCard.content = 'summary_large_image';
}
