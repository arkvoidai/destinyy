export interface SiteConfig {
  name: string;
  legalName: string;
  founder: string;
  email: string;
  xHandle: string;
  xUrl: string;
  siteUrl: string;
  year: number;
  motion: {
    emberLine: boolean;
    pointerDrift: boolean;
    imageDrift: boolean;
    grain: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: 'Arkvoid',
  legalName: 'Arkvoid Inc.',
  founder: 'Manish Talukdar',
  email: 'heyarkvoid@gmail.com',
  xHandle: '@ArkvoidAI',
  xUrl: 'https://x.com/ArkvoidAI',
  siteUrl: '',
  year: 2026,
  motion: {
    emberLine: true,
    pointerDrift: true,
    imageDrift: true,
    grain: true,
  },
};
