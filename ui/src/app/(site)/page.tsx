import {SidebarNav} from '@/components/SidebarNav'
import {ProjectSwiper} from '@/components/ProjectSwiper'
import {getProjects, getSiteSettings} from '@/lib/data'

export default async function HomePage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()])

  return (
    <div className="outer-wrapper relative flex h-svh justify-between pt-3 pr-2.5 pb-2.5 pl-2.5 mobile:h-auto mobile:flex-col-reverse mobile:justify-end mobile:p-2">
      <SidebarNav settings={settings} projects={projects} variant="home" />
      <ProjectSwiper projects={projects} />
    </div>
  )
}
