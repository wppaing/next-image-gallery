import Head from 'next/head';
import Image from 'next/image';
import cloudinary from '../utils/cloudinary';
import getBase64ImageUrl from '../utils/generateBlurPlaceHolder';
import type { ImageProps } from '../utils/types';

export default function Home({ images }: { images: ImageProps[] }) {
  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
      </Head>

      <main>
        <div>
          {images.map((image: ImageProps) => (
            <Image
              key={image.id}
              alt=""
              placeholder="blur"
              blurDataURL={image.blurDataUrl}
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${image.public_id}.${image.format}`}
              width={720}
              height={480}
              className="img"
            />
          ))}
        </div>
      </main>

      <style jsx>{`
        div {
          padding: 1rem;
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        div :global(img) {
          border-radius: 0.5rem;
          max-width: 100%;
          height: auto;
        }

        div :global(img):hover {
          filter: brightness(1.1);
        }

        @media screen and (min-width: 640px) {
          div {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media screen and (min-width: 1280px) {
          div {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media screen and (min-width: 1500px) {
          div {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    // .max_results()
    .execute();

  const reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      width: result.width,
      height: result.height,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((resource: ImageProps) => {
    return getBase64ImageUrl(resource);
  });

  const imagesWithBlurUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
