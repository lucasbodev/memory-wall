/** @type {import('next').NextConfig} */
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
    includePaths: [path.join(process.cwd(), 'styles')],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ssgeanvho0lfwmv5.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};
 
const withNextIntl = createNextIntlPlugin();
 
export default withNextIntl(nextConfig);