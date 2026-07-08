import {SidebarNav} from '@/components/SidebarNav'
import {ProjectSwiper} from '@/components/ProjectSwiper'
import {getProjects, getSiteSettings} from '@/lib/data'

export default async function HomePage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()])

  return (
    <div className="outer-wrapper">
      <SidebarNav settings={settings} projects={projects} variant="home" />
      <ProjectSwiper projects={projects} />
    </div>
  )
}
