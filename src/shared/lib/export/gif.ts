import gifshot from 'gifshot'

interface EncodeGifOptions {
  frames: string[]
  width: number
  height: number
  frameSeconds: number
}

export function encodeGif({
  frames,
  width,
  height,
  frameSeconds,
}: EncodeGifOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    gifshot.createGIF(
      {
        images: frames,
        gifWidth: width,
        gifHeight: height,
        interval: frameSeconds,
        numWorkers: 2,
      },
      (result) => {
        if (result.error) reject(new Error(result.errorMsg))
        else resolve(result.image)
      },
    )
  })
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
