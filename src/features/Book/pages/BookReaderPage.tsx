import {api} from "@/api";
import {SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {BookCoverImage, BookReaderAppBar} from "@/features/Book/components";
import {useBook} from "@/features/Book/hooks";
import {useBookReaderStore} from "@/stores";
import {PageView} from "@/types/book";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function BookReaderPage() {
  const {bookId} = useParams();
  const [currentPage, setCurrentPage] = useState<PageView | null>(null);
  const [currentPageId, setCurrentPageId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  const {recordLastVisitedPageId, findLastVisitedPageId, removeLastVisitedPageId} =
    useBookReaderStore();
  const {book, BookNotFoundAlert} = useBook(+bookId!);
  const {data: introPage} = useQuery(
    [keys.GET_INTRO_PAGE],
    () => api.pages.fetchIntroPage(book!.id),
    {
      enabled: !!book,
      refetchOnWindowFocus: false,
    },
  );
  const {data: page} = useQuery(
    [keys.GET_PAGE, currentPageId],
    () => api.pages.fetchPage(book!.id, currentPageId!),
    {
      enabled: Boolean(book && currentPageId),
      refetchOnWindowFocus: false,
    },
  );

  const onLoadPage = (pageId: number) => {
    setCurrentPageId(pageId);
    recordLastVisitedPageId(bookId!, pageId);
  };

  const onGoBackToIntro = () => {
    setCurrentPageId(undefined);
  };

  const onGoBack = () => {
    if (book?.status === "PUBLISHED") return navigate(`/books/${bookId}`);
    navigate(`/studio/books/${bookId}/flow-chart`);
  };

  useEffect(() => {
    setCurrentPageId(findLastVisitedPageId(bookId!));
  }, []);

  useEffect(() => {
    if (page) return setCurrentPage({...page});
    if (!findLastVisitedPageId(bookId!) && introPage) return setCurrentPage({...introPage});
  }, [introPage, page]);

  useEffect(() => {
    if (currentPage?.isIntro || currentPage?.isEnding) removeLastVisitedPageId(bookId!);
  }, [currentPage]);

  if (!book)
    return (
      <div className="mobile-view justify-center items-center">
        <SpinningLoader color="#888888" />
        <BookNotFoundAlert />
      </div>
    );

  return (
    <div className="mobile-view pt-16 pb-4">
      <BookReaderAppBar book={book} />
      <div className="flex-1 p-6 flex flex-col items-stretch">
        {currentPage?.isIntro ? (
          <>
            <BookCoverImage className="self-center w-full max-w-[400px] rounded-lg" />
            <SizedBox height={32} />
          </>
        ) : null}
        <h1 className="self-center text-center font-medium text-[22px]">{currentPage?.title}</h1>
        <SizedBox height={24} />
        <p className="flex-1 text-justify leading-[2.2rem]">
          {currentPage?.content}
          {currentPage?.isEnding ? <span className="font-bold">&nbsp;[ 완결 ]</span> : null}
        </p>
        <SizedBox height={32} />
        <div className="border-t border-[#999999]" />
        <SizedBox height={32} />
        <div className="flex flex-col items-stretch gap-3">
          {currentPage?.choices.map(choice => (
            <button
              key={choice.id}
              className="self-center w-full max-w-[400px] px-4 py-2 rounded-lg bg-[#E3E3E3] font-medium leading-[2rem] disabled:bg-[#BBBBBB] disabled:text-[#666666]"
              onClick={() => onLoadPage(choice.destinationPageId!)}
              disabled={!choice.destinationPageId}>
              {choice.content}
            </button>
          ))}
          {currentPage?.isEnding ? (
            <>
              <button
                className="self-center w-full max-w-[400px] px-4 py-2 rounded-lg bg-[#E3E3E3] font-medium leading-[2rem] disabled:bg-[#BBBBBB] disabled:text-[#666666]"
                onClick={onGoBackToIntro}>
                처음부터 다시 읽기
              </button>
              <button
                className="self-center w-full max-w-[400px] px-4 py-2 rounded-lg bg-[#E3E3E3] font-medium leading-[2rem] disabled:bg-[#BBBBBB] disabled:text-[#666666]"
                onClick={onGoBack}>
                {book.status === "PUBLISHED" ? "작품 소개로 돌아가기" : "플로우차트로 돌아가기"}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
