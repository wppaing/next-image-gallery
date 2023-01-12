import cloudinary from '../utils/cloudinary';

export default function Home() {
  return <main>Hello Next.js</main>;
}

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .max_results(2)
    .execute();

  const reducedResults = [];

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

  return {
    props: {
      reducedResults,
    },
  };
}
