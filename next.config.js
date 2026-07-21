/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/assessment", destination: "/" }]
  },
}
module.exports = nextConfig
