import type { Metadata } from "next";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import { 
  geistSans, 
  geistMono, 
  space,
  playfair
} from "@/styles/fonts";
import { headers } from "next/headers";
import { AuthProvider } from "@/data/contexts/AuthContext";
import { ParishProvider, ParishWhitelabel } from "@/data/contexts/ParishContext";
import { Toaster } from "sonner";
import { notFound } from "next/navigation";

async function getParishBySlug(
  slug: string,
): Promise<ParishWhitelabel | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/parishes/slug/${slug}`,
      {
        next: { revalidate: 90 },
      },
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const slug = headersList.get('x-parish-slug');

  if (!slug) {
    return {
      title: 'Gestão do Dízimo | Plataforma Paroquial',
      description: 'Sistema de gestão de dizimistas e devoluções',
    };
  }

  const parish = await getParishBySlug(slug);
  return {
    title: parish ? `${parish.name} | Pastoral do Dízimo` : 'Paróquia não encontrada',
    description: `Portal do dizimista - ${parish?.name ?? ''}`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const slug = headersList.get('x-parish-slug');

  let parish: ParishWhitelabel | null = null;

  if (slug) {
    parish = await getParishBySlug(slug);

    if (!parish) {
      notFound();
    }
  }

  const dynamicThemeStyle = parish
    ? ({
        ...(parish.themePrimaryColor && {
          '--primary': parish.themePrimaryColor,
          '--sidebar-primary': parish.themePrimaryColor,
          '--ring': parish.themePrimaryColor,
        }),
        ...(parish.themeSecondaryColor && {
          '--secondary': parish.themeSecondaryColor,
        }),
      } as React.CSSProperties)
    : undefined;

  return (
    <html 
      lang="pt-BR" 
      className="dark"
      style={dynamicThemeStyle}
      suppressHydrationWarning
    >
      <body 
        className={cn(
          "min-h-full flex flex-col font-space-grotesk",
          geistSans.variable, 
          geistMono.variable, 
          playfair.variable, 
          space.variable
        )}
      >
        <ParishProvider parish={parish}>
          <AuthProvider>
            {children}
            <Toaster 
              theme="dark" 
              closeButton
            />
          </AuthProvider>
        </ParishProvider>
      </body>
    </html>
  );
}
