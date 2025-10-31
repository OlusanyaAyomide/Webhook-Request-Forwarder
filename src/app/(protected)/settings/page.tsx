
import { getAppsWithProjects } from './settings.actions'
import Settings from '@/components/protected/Settings'

export default async function SettingsPage() {
  const { apps } = await getAppsWithProjects()

  return <Settings apps={apps || []} />
}