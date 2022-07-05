import { FC, useEffect, useState } from 'react'
import YouTube from 'react-youtube'

const pickRandom = (from: any[]) =>
  from[Math.floor(Math.random() * from.length)]

const Wednesday: FC = () => {
  const [videoIds, setVideoIds] = useState<string[]>([])
  const [currentVideoId, setCurrentVideoId] = useState<string>()

  useEffect(() => {
    const getAndSetVideoIds = async () => {
      setVideoIds(await (await fetch('/api/videos')).json())
    }
    getAndSetVideoIds()
  }, [])

  useEffect(() => {
    setCurrentVideoId(pickRandom(videoIds))
  }, [videoIds])

  const handleVideoEnd = () => {
    setCurrentVideoId(pickRandom(videoIds))
  }

  return (
    <div className="video-background">
      <div className="video-foreground">
        <YouTube
          videoId={currentVideoId}
          opts={{ playerVars: { autoplay: 1, controls: 0 } }}
          onEnd={handleVideoEnd}
        />
      </div>
    </div>
  )
}

export default Wednesday
