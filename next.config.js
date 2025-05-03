/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker\.entry\.js$/,
      use: { loader: "file-loader" },
    });
    return config;
  },
  env: {
    NEXT_PUBLIC_CV_DOWNLOAD_TOKEN: process.env.CV_DOWNLOAD_TOKEN,
  },
};

module.exports = nextConfig;
