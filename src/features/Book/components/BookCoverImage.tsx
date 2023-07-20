import {ImgHTMLAttributes, useState} from "react";

type Props = ImgHTMLAttributes<HTMLImageElement>;

export default function BookCoverImage({src, ...props}: Props) {
  const [error, setError] = useState(false);

  const onError = () => setError(true);

  if (!src || error) return <img src="/assets/images/book-fallback.webp" {...props} />;

  return <img src={src} onError={onError} {...props} />;
}
