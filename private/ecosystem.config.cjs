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
        VITE_API_URL: '/api'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
}; 