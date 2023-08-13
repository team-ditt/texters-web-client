import {api} from "@/api";
import {SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {BookCoverImage, BookReaderAppBar} from "@/features/Book/components";
import {useMyBookInfo} from "@/features/FlowChart/hooks";
import {useAuthGuard, useMobileViewGuard} from "@/hooks";
import {useBookReaderStore} from "@/stores";
import {PageView} from "@/types/book";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function BookDemoReaderPage() {
  const {bookId} = useParams();
  const [currentPage, setCurrentPage] = useState<PageView | null>(null);
  const [currentPageId, setCurrentPageId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  const {recordHistory, findLastHistory, hasHistory, canGoBack, popHistory, resetHistory} =
    useBookReaderStore();
  const {book, NotAuthorAlert} = useMyBookInfo(+bookId!);

  const queryClient = useQueryClient();
  const {data: introPage} = useQuery(
    [keys.GET_INTRO_PAGE],
    () => api.pages.fetchIntroPage(book!.id),
    {
      enabled: !!book,
      refetchOnWindowFocus: false,
    },
  );
  const {data: page, isFetching} = useQuery(
    [keys.GET_PAGE, currentPageId],
    () => api.pages.fetchPage(book!.id, currentPageId!),
    {
      enabled: Boolean(book && currentPageId),
      refetchOnWindowFocus: false,
    },
  );

  const onLoadPage = (pageId: number) => {
    recordHistory(bookId!, {pageId, isEnding: false});
    setCurrentPageId(pageId);
  };
  const onGoBackToIntro = () => {
    resetHistory(bookId!);
    setCurrentPageId(undefined);
  };
  const onGoBack = () => navigate(`/studio/books/${bookId}/flow-chart`, {replace: true});
  const onPopHistory = () => {
    popHistory(bookId!);
    setCurrentPageId(findLastHistory(bookId!)?.pageId);
  };

  const {RequestSignInDialog} = useAuthGuard();
  const {MobileViewAlert} = useMobileViewGuard();
  useEffect(() => {
    if (!bookId) return;

    setCurrentPageId(findLastHistory(bookId!)?.pageId);
    return () => {
      resetHistory(bookId!);
    };
  }, [bookId]);
  useEffect(() => {
    if (page) return setCurrentPage({...page});
    if (findLastHistory(bookId!)?.isIntro) return;
    if (!hasHistory(bookId!) && introPage) {
      recordHistory(bookId!, {pageId: introPage.id, isIntro: true});
      return setCurrentPage({...introPage});
    }
  }, [introPage, page]);
  useEffect(() => {
    if (!currentPage) return;
    document.getElementById("root")?.scrollTo({top: 0});
  }, [currentPage]);

  if (!book)
    return (
      <div className="mobile-view justify-center items-center">
        <SpinningLoader color="#888888" />
        <MobileViewAlert />
        <RequestSignInDialog />
      </div>
    );

  return (
    <div className="mobile-view pt-16 pb-4">
      <BookReaderAppBar book={book} />
      <div className="flex-1 p-6 flex flex-col items-stretch">
        {findLastHistory(bookId!)?.isIntro ? (
          <>
            <BookCoverImage
              className="self-center w-full max-w-[400px] rounded-lg"
              src={book.coverImageUrl ?? undefined}
            />
            <SizedBox height={32} />
          </>
        ) : null}
        <h1 className="self-center text-center font-medium text-[22px]">{currentPage?.title}</h1>
        <SizedBox height={24} />
        <p className="flex-1 text-justify leading-[2.2rem] whitespace-pre-wrap">
          {currentPage?.content}
          {currentPage?.isEnding ? <span className="font-bold">&nbsp;[ 완결 ]</span> : null}
        </p>
        <SizedBox height={32} />
        <div className="border-t border-[#999999]" />
        <SizedBox height={32} />
        <div className="flex flex-col items-stretch gap-3">
          {canGoBack(bookId!) ? (
            <button
              className="self-center w-full max-w-[400px] min-h-[48px] px-4 py-2 rounded-lg bg-[#E3E3E3] font-medium leading-[2rem] disabled:text-[#666666] disabled:opacity-50"
              onClick={onPopHistory}
              disabled={isFetching}>
              뒤로가기
            </button>
          ) : null}
          {currentPage?.choices.map(choice => (
            <button
              key={choice.id}
              className="self-center w-full max-w-[400px] min-h-[48px] px-4 py-2 rounded-lg bg-[#E3E3E3] font-medium leading-[2rem] disabled:text-[#666666] disabled:opacity-50"
              onClick={() => onLoadPage(choice.destinationPageId!)}
              disabled={!choice.destinationPageId || isFetching}>
              {choice.content}
            </button>
          ))}
          {currentPage?.isEnding ? (
            <>
              <button
                className="self-center w-full max-w-[400px] min-h-[48px] px-4 py-2 rounded-lg bg-[#E3E3E3] font-medium leading-[2rem]] disabled:opacity-50"
                onClick={onGoBackToIntro}
                disabled={isFetching}>
                처음부터 다시 읽기
              </button>
              <button
                className="self-center w-full max-w-[400px] min-h-[48px] px-4 py-2 rounded-lg bg-[#E3E3E3] font-medium leading-[2rem]"
                onClick={onGoBack}>
                플로우차트로 돌아가기
              </button>
            </>
          ) : null}
        </div>
      </div>

      <MobileViewAlert />
      <RequestSignInDialog />
      <NotAuthorAlert />
    </div>
  );
}
