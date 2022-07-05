import type { NextApiHandler } from 'next'
import cache from 'memory-cache'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/playlistItems'

const fetchPlaylistItems = () => {
  const query = {
    key: process.env.YOUTUBE_KEY,
    playlistId: 'PLy3-VH7qrUZ5IVq_lISnoccVIYZCMvi-8', // zimonitrome Wednesday vids
    part: 'contentDetails',
    maxResults: '50', // max allowed, we can deal with paging later
    order: 'date', // we want the most recent uploads
  }

  const queryString = new URLSearchParams(query).toString()

  return fetch(`${YOUTUBE_API_BASE}?${queryString}`)
}

const videosHandlerCacheId = Symbol()
const videosHandler: NextApiHandler = async (req, res) => {
  const cachedResponse = cache.get(videosHandlerCacheId)
  if (cachedResponse) {
    console.info(`Returning cached playlist: ${cachedResponse.join(', ')}`)
    return res.json(cachedResponse)
  }

  const playlistItemsResponse = await fetchPlaylistItems()
  if (!playlistItemsResponse.ok) {
    throw new Error(
      `Error fetching videos (${
        playlistItemsResponse.status
      }): ${await playlistItemsResponse.text()}`
    )
  }

  const playlistItems = await playlistItemsResponse.json()
  const playlistIds = playlistItems.items.map(
    (item) => item.contentDetails.videoId
  )

  console.info(`Updating playlist cache: ${playlistIds.join(', ')}`)
  cache.put(videosHandlerCacheId, playlistIds, /* 24h */ 24 * 60 * 60 * 1000)

  return res.json(playlistIds)
}

export default videosHandler
