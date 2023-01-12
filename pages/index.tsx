import { useEffect } from 'react'
import cloudinary from '../utils/cloudinary'
import getBase64ImageUrl from '../utils/generateBlurPlaceHolder'
import type { ImageProps } from '../utils/types'

export default function Home(props: {}) {
  useEffect(() => {
    console.log(props)
  }, [])

  return <main>Hello Next.js</main>
}

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .max_results(2)
    .execute()

  const reducedResults = []

  let i = 0
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      width: result.width,
      height: result.height,
      public_id: result.public_id,
      format: result.format,
    })
    i++
  }

  const blurImagePromises = results.resources.map((resource: ImageProps) => {
    return getBase64ImageUrl(resource)
  })

  const imagesWithBlurUrls = await Promise.all(blurImagePromises)

  return {
    props: {
      reducedResults,
      imagesWithBlurUrls,
    },
  }
}
