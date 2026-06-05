import { client } from './client'

export const configApi = {
  getAll: () => client.get('/api/config/all').then(r => r.data),
  update: (section: string, key: string, value: unknown) =>
    client.put('/api/config/update', { section, key, value }).then(r => r.data),
  getProviders: () => client.get('/api/llm/providers').then(r => r.data),
  testLLM: (provider: string, model_name: string, api_key: string) =>
    client.post('/api/llm/test', { provider, model_name, api_key }).then(r => r.data),
}
