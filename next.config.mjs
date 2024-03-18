/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost' , 's3.ap-south-1.amazonaws.com', "loremflickr.com"], // Add any other domains if needed
      },
};

export default nextConfig;
