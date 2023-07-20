import {SizedBox} from "@/components";
import BookCoverImage from "@/features/Book/components/BookCoverImage";
import {Book} from "@/types/book";
import {toCompactNumber} from "@/utils/formatter";
import {ReactComponent as LikedIcon} from "assets/icons/liked.svg";
import {ReactComponent as ViewedIcon} from "assets/icons/viewed.svg";
import {HTMLAttributes, useMemo} from "react";
import {Link} from "react-router-dom";

type ListProps = HTMLAttributes<HTMLDivElement> & {
  books: Book[];
};

export default function BookList({books, className, ...props}: ListProps) {
  return (
    <div className={`self-stretch flex flex-col gap-[8px] ${className}`} {...props}>
      {books.map(book => (
        <BookListItem key={book.id} book={book} />
      ))}
    </div>
  );
}

type ListItemProps = {
  book: Book;
};

function BookListItem({book}: ListItemProps) {
  return useMemo(
    () => (
      <Link className="border border-black rounded-lg flex" to={`/books/${book.id}`}>
        <BookCoverImage
          className="h-full max-h-[112px] aspect-square rounded-s-lg"
          src={book.coverImageUrl ?? undefined}
        />
        <div className="flex-1 flex flex-col justify-between px-3 py-2">
          <span className="font-bold text-[18px] text-[#2D3648] text-ellipsis line-clamp-1">
            {book.title}
          </span>
          <div className="flex flex-row items-center">
            <ViewedIcon fill="#999999" />
            <span className="ms-0.5 text-[12px] text-[#999999]">
              {toCompactNumber(book.viewed)}
            </span>
            <SizedBox width={12} />
            <LikedIcon fill="#999999" />
            <span className="ms-0.5 text-[12px] text-[#999999]">{toCompactNumber(book.liked)}</span>
          </div>
          <span className="font-semibold text-[14px] text-[#1A202C]">{book.author.penName}</span>
          <span className="text-[14px] text-[#717D96] text-ellipsis line-clamp-1">
            {book.description}
          </span>
        </div>
      </Link>
    ),
    [book.id],
  );
}
