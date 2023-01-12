import type { ImageProps } from './types';

async function getBase64ImageUrl(image: ImageProps) {
  const response = await fetch(`https://res.cloudinary.com`);
}
