import type { NextApiHandler } from 'next'
import cache from 'memory-cache'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/playlistItems'

type YouTubeResponse = { nextPageToken?: string, items: Array<{ contentDetails: { videoId: string }}> }

const fetchPlaylistItems = async (additionalParams: Record<string, string> = {}): Promise<YouTubeResponse['items']> => {
  console.info('Fetching playlist items', additionalParams)
  const query = {
    key: process.env.YOUTUBE_KEY,
    playlistId: 'PLy3-VH7qrUZ5IVq_lISnoccVIYZCMvi-8', // zimonitrome Wednesday vids
    part: 'contentDetails',
    maxResults: '50', // max allowed, we can deal with paging later
    order: 'date', // we want the most recent uploads
    ...additionalParams,
  }

  const queryString = new URLSearchParams(query).toString()

  const resp = await fetch(`${YOUTUBE_API_BASE}?${queryString}`)
  
  if (!resp.ok) {
    throw new Error(
      `Error fetching videos (${
        resp.status
      }): ${await resp.text()}`
    )
  }

  const { items, nextPageToken } = await resp.json() as YouTubeResponse
  if (!nextPageToken) return items
  return [...items, ...await fetchPlaylistItems({pageToken: nextPageToken})]
}

const videosHandlerCacheId = Symbol()
const videosHandler: NextApiHandler = async (req, res) => {
  const cachedResponse = cache.get(videosHandlerCacheId)
  if (cachedResponse) {
    console.info(`Returning cached playlist: ${cachedResponse.join(', ')}`)
    return res.json(cachedResponse)
  }

  const playlistItems = await fetchPlaylistItems()
  const playlistIds = playlistItems.map(
    (item) => item.contentDetails.videoId
  )

  console.info(`Updating playlist cache: ${playlistIds.join(', ')}`)
  cache.put(videosHandlerCacheId, playlistIds, /* 24h */ 24 * 60 * 60 * 1000)

  return res.json(playlistIds)
}

export default videosHandler
