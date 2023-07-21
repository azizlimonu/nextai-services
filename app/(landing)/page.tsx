import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <p className='text-6xl text-green-500'>
        Landing Page Unprotected Page
      </p>
      <div>
        <Button>
          <Link href='/sign-in'>
            Login
          </Link>
        </Button>
        <Button>
          <Link href='/sign-up'>
            Register
          </Link>
        </Button>
      </div>
    </>
  )
}
