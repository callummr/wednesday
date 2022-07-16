import Wednesday from '../components/wednesday'
import NotWednesday from '../components/not-wednesday'

export default function Home() {
  const isWednesday = new Date().getDay() === 3

  return isWednesday ? <Wednesday/> : <NotWednesday />
}
