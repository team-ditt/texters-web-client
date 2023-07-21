import bookFallbackImage from "assets/images/book-fallback.webp";
import {ImgHTMLAttributes, useState} from "react";

type Props = ImgHTMLAttributes<HTMLImageElement>;

export default function BookCoverImage({src, ...props}: Props) {
  const [error, setError] = useState(false);

  const onError = () => setError(true);

  if (!src || error) return <img src={bookFallbackImage} {...props} />;

  return <img src={src} onError={onError} {...props} />;
}
