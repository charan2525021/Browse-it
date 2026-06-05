import { useEffect } from 'react'
import { configApi } from '@/api/configApi'

export function useConfig() {
  useEffect(() => {
    configApi.getAll().catch(() => {})
  }, [])
}
