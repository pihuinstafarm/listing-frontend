module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|json|css|js|ttf)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=9999999999, must-revalidate',
          }
        ],
      },
    ]
  },
  images: {
      unoptimized: false,
      deviceSizes: [480,640, 750, 828, 1080, 1200, 1400],
      minimumCacheTTL: 31536000,
      domains: ['firebasestorage.googleapis.com', 'example.com'],
      remotePatterns: [
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: '/v0/b/**',
            //pathname: '/v0/b/jarvis-a6aba.appspot.com/**',
          },
          {
            protocol: 'https',
            hostname: 'example.com',
            port: '',
            pathname: '/**',
          },
        ],
  },
  i18n: {
      locales: ["en"],
      defaultLocale: "en",
  },
}