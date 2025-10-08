/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // 프론트에서 /api/... 로 요청하면
        source: "/api/:path*", 
        // Vercel이 대신 EC2로 HTTP 요청 보냄
        destination: "http://13.209.77.82:8080/:path*", 
      },
    ];
  },
};

module.exports = nextConfig;