
import http from '@/utils/request'

export const reqRequest = (params) => http.post('/api/url', params)
