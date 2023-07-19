import {api} from "@/api";
import {keys} from "@/constants";
import {BookCoverImage} from "@/features/Book/components";
import {Book} from "@/types/book";
import {toBalancedTwoLines} from "@/utils/formatter";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import "swiper/css";

import "swiper/css/pagination";
import {Autoplay, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";

export default function WeeklyMostViewedCarousel() {
  const {data: books} = useQuery(
    [keys.GET_WEEKLY_MOST_VIEWED_BOOKS_QUERY],
    api.books.fetchWeeklyMostViewedBooks,
  );

  if (!books) return <></>;

  return (
    <div className="relative pt-6">
      <Swiper
        className="w-full aspect-[3/2]"
        modules={[Pagination, Autoplay]}
        autoplay={{delay: 5000, disableOnInteraction: false}}
        loop={true}
        pagination={{clickable: true}}>
        {books.map(book => (
          <SwiperSlide key={book.id}>
            <CarouselSlide book={book} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function CarouselSlide({book}: {book: Book}) {
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const SINGLE_LINE_HEIGHT = 30;
    const isOverflowed = titleRef.current.clientHeight > SINGLE_LINE_HEIGHT;
    titleRef.current.innerText = isOverflowed ? toBalancedTwoLines(book.title) : book.title;
  }, [titleRef.current]);

  return (
    <Link className="relative" to={`/books/${book.id}`}>
      <BookCoverImage
        className="w-full h-full object-cover"
        src={book.coverImageUrl ?? undefined}
      />
      <div className="absolute top-0 left-0 w-full h-full px-4 py-6 flex flex-col justify-end bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.7)]">
        <span ref={titleRef} className="font-bold text-[20px] text-white">
          {book.title}
        </span>
        <span className="text-white">{book.author.penName}</span>
      </div>
    </Link>
  );
}
