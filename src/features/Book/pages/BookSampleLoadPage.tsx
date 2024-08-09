import {api} from "@/api";
import {SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {BookCoverImage, BookReaderAppBar} from "@/features/Book/components";
import {usePublishedBookInfo} from "@/features/Book/hooks";
import {useBookReaderStore} from "@/stores";
import useDashboardStore from "@/stores/useDashboardStore";
import {Book, FlowChart, PageView} from "@/types/book";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useLayoutEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";

const isValidFlowChart = (obj: {[key: string]: string}) => {
  if (!obj) return false;
  if (typeof obj?.title !== "string") return false;
  if (typeof obj?.description !== "string") return false;
  if (!obj?.lanes) return false;
  if (!Array.isArray(obj.lanes)) return false;
  return true;
};

export default function BookSampleLoadPage() {
  const [searchParams] = useSearchParams();
  const sampleUrl = searchParams.get("sampleUrl");
  const navigate = useNavigate();
  const {saveSampleBook} = useDashboardStore();
  useLayoutEffect(() => {
    if (!sampleUrl) return;
    fetch(sampleUrl).then(
      async res => {
        const jsonObject = await res.json();
        if (!isValidFlowChart(jsonObject)) {
          alert("유효하지 않은 데이터입니다!");
          navigate("/");
          return;
        }
        const sampleBook = saveSampleBook(
          {
            id: 0,
            title: jsonObject.title,
            description: jsonObject.description,
            sourceUrl: sampleUrl,
          },
          {...jsonObject, sourceUrl: sampleUrl} as FlowChart,
        );
        navigate("/", {replace: true});
        navigate(`/studio/books/${sampleBook.id}/read`);
      },
      () => {
        alert("데이터 조회에 실패하였습니다!");
        navigate("/");
      },
    );
  }, [sampleUrl]);

  return <div className="mobile-view pt-16 pb-4"></div>;
}
