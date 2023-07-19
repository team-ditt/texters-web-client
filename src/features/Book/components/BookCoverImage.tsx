import {ImgHTMLAttributes, useState} from "react";

type Props = ImgHTMLAttributes<HTMLImageElement>;

export default function BookCoverImage({src, ...props}: Props) {
  const fallbackImageSrc = "assets/images/book-fallback.webp";
  const [error, setError] = useState(false);

  const onError = () => setError(true);

  if (!src || error) return <img src={fallbackImageSrc} {...props} />;

  return <img src={src} onError={onError} {...props} />;
}
