export const siteConfig = {
  name: "Daniel From Zero",
  shortName: "Daniel From Zero",
  description:
    "Programador de profissão e empreendedor em construção. Documentando a jornada para sair do zero — acertos, erros e o que for aprendendo no caminho.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "pt_BR",
  author: {
    name: "Daniel Peixoto",
    url: "https://www.youtube.com/@DanielFromZero",
  },
  links: {
    youtube: "https://www.youtube.com/@DanielFromZero",
    // Futuras redes sociais entram aqui
  },
} as const;

export type SiteConfig = typeof siteConfig;
