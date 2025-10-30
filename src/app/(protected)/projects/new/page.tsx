import NewProjectForm from "@/components/protected/NewProjectForm"
import { getApps } from "./actions"

export default async function NewProject() {

  const apps = await getApps()

  return <NewProjectForm apps={apps} />
}