export type StudioCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
};

export type SiteContent = {
  studioName: string;
  logo: string;
  hero: {
    image: string;
    title: string;
    subtitle: string;
  };
  cards: StudioCard[];
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
};
