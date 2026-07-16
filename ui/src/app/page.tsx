import {SidebarNav} from '@/components/SidebarNav'
import {ProjectSwiper} from '@/components/ProjectSwiper'
import {getProjects, getSiteSettings} from '@/lib/data'

export default async function HomePage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()])

  return (
    <div className="relative flex h-svh justify-between pt-3 pr-2.5 pb-2.5 pl-2.5 max-md:min-h-svh max-md:flex-col max-md:items-stretch max-md:justify-start max-md:gap-0 max-md:p-0">
      <SidebarNav settings={settings} projects={projects} variant="home" />
      <ProjectSwiper projects={projects} />
    </div>
  )
}
