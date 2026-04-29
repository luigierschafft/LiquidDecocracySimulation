/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/proposals',
        destination: '/topics',
        permanent: true,
      },
      {
        source: '/play',
        destination: '/playful',
        permanent: true,
      },
      {
        source: '/play/:path*',
        destination: '/playful/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
