const config = {}

if (process.env.NODE_ENV === 'development') {
  try {
    config.BASE_URL = import.meta.env.BASE_URL
  } catch (e) {
    config.BASE_URL = process.env.BASE_URL
  }
} else {
  config.BASE_URL = process.env.BASE_URL
}

export default config
