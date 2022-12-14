

/** @type {import('next').NextConfig} */



const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: [/chunks\/images\/.*$/],
  disable: process.env.NODE_ENV === 'development'
})


const securityHeaders = [
  
  //Informs the browser that this page should only access pages using HTTPS
  //Blocks access to websites that can only be served over HTTP
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  //Prevents page from loading if it detects XSS attacks
  //Can be used for legacy browsers that don't support CSP
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }

]


module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: [ 'diamondapp.com', 'ancient-reef-76919.herokuapp.com'],
  },
  async headers(){
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      }
    ]
  }
})
