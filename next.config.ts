import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Opciones de configuración */
  typescript: {
    // Ignorar errores de TypeScript al compilar
    ignoreBuildErrors: true,
  },
  // @ts-ignore
  eslint: {
    // Ignorar reglas de estilo al compilar
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;