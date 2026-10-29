declare module 'gifshot' {
  interface CreateGifOptions {
    images: string[]
    gifWidth: number
    gifHeight: number
    interval: number
    numWorkers: number
  }

  interface CreateGifResult {
    error: boolean
    errorMsg?: string
    image: string
  }

  const gifshot: {
    createGIF(
      options: CreateGifOptions,
      callback: (result: CreateGifResult) => void,
    ): void
  }

  export default gifshot
}
