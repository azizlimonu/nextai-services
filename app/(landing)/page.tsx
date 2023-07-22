import LandingHero from '@/components/LandingHero'
import LandingNavbar from '@/components/LandingNavbar'

export default function Home() {
  return (
    <div className='h-full'>
      <LandingNavbar />
      <LandingHero />
    </div>
  )
}
