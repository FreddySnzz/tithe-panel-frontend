export interface PublicParishItem {
  id: string;
  name: string;
  slug: string | null;
  logoUrl: string | null;
}

export interface ParishDetails {
  id: string;
  name: string;
  slug: string | null;
  phone: string;
  document: string;
  priest: string | null;
  themePrimaryColor: string | null;
  themeSecondaryColor: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}