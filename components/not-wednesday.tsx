import Image from 'next/image'
import { FC } from 'react'

const NotWednesday: FC = () => (
  <div className="align-center">
    <Image
      src="/notwednesday.jpg"
      alt="It is not Wednesday, my dudes :("
      width={500}
      height={419}
    />
  </div>
)

export default NotWednesday
