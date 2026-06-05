import { client } from './client'

export const browserApi = {
  screenshot: () => client.get('/api/browser/screenshot').then(r => r.data),
  state: () => client.get('/api/browser/state').then(r => r.data),
}
