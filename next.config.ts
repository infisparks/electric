/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...other config options…

  images: {
    domains: ['images.pexels.com'],
    // alternatively, you can use remotePatterns if you need more control:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'images.pexels.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

module.exports = nextConfig;
