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

export default fetchPlaylistItems
