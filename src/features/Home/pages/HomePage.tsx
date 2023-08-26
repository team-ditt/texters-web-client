import {api} from "@/api";
import {MobileFooter, SizedBox} from "@/components";
import {keys} from "@/constants";
import {BookList} from "@/features/Book/components";
import {BookHelpBanner, IdeaRoomBanner, WeeklyMostViewedCarousel} from "@/features/Home/components";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";

export default function HomePage() {
  const {data: paginatedBooks} = useQuery(
    [keys.GET_BOOKS, {page: 1, limit: 10, order: "published-date"}],
    () => api.books.fetchPublishedBooks({page: 1, limit: 10, order: "published-date"}),
  );

  return (
    <div className="mobile-view pt-16">
      <WeeklyMostViewedCarousel />
      {paginatedBooks ? (
        <div className="flex-1 px-6 py-8 flex-col items-stretch">
          <div className="flex px-2 justify-between items-end">
            <span className="font-bold text-[24px]">최근 올라온 작품</span>
            <Link className="font-bold text-[13px] text-[#818181]" to="/books">
              모두 보기
            </Link>
          </div>
          <SizedBox height={8} />
          <BookList books={paginatedBooks.data} />
          <SizedBox height={8} />
        </div>
      ) : null}
      <BookHelpBanner />
      <IdeaRoomBanner />
      <MobileFooter />
    </div>
  );
}
