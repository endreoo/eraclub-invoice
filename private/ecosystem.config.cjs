module.exports = {
  apps: [
    {
      name: 'vera-client',
      script: 'npm',
      args: 'run preview',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 5172,
        VITE_API_URL: 'http://37.27.142.148:5171'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'vera-server',
      script: 'src/server/server.js',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 5171,
        JWT_SECRET: 'hotelonline-api-secret-key',
        API_BASE_URL: 'http://37.27.142.148:3000',
        CORS_ORIGIN: 'http://37.27.142.148:5172'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      interpreter: 'node',
      interpreter_args: '--experimental-modules'
    }
  ]
}; 