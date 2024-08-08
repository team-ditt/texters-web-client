import {api} from "@/api";
import {keys} from "@/constants";
import {useProfile} from "@/features/Member/hooks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export default function useBookLike(bookId?: number) {
  const {profile} = useProfile();
  const {data: likedResult} = useQuery(
    [keys.GET_BOOK_LIKED, 1],
    () => api.bookLiked.checkBookLiked(1, bookId!),
    {
      enabled: !!profile && !!bookId,
      refetchOnWindowFocus: false,
    },
  );

  const queryClient = useQueryClient();
  const {mutate: toggleLike} = useMutation(
    () => {
      if (!profile || !bookId) return Promise.reject();
      return api.bookLiked.toggleBookLiked(1, bookId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([keys.GET_BOOK_LIKED]);
        queryClient.invalidateQueries([keys.GET_BOOK]);
        queryClient.invalidateQueries([keys.GET_BOOKS], {type: "all"});
        queryClient.invalidateQueries([keys.GET_WEEKLY_MOST_VIEWED_BOOKS], {type: "all"});
      },
    },
  );

  return {
    isLiked: likedResult?.liked ?? false,
    toggleLike,
  };
}
