import {api} from "@/api";
import {keys} from "@/constants";
import {useAuthStore} from "@/stores";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export default function useBookLike(bookId?: number) {
  const didSignIn = useAuthStore(state => !!state.accessToken);
  const {data: profile} = useQuery([keys.GET_MY_PROFILE], api.members.fetchProfile, {
    enabled: didSignIn,
  });
  const {data: likedResult} = useQuery(
    [keys.GET_BOOK_LIKED, profile?.id],
    () => api.bookLiked.checkBookLiked(profile!.id, bookId!),
    {
      enabled: !!profile && !!bookId,
    },
  );

  const queryClient = useQueryClient();
  const {mutate: toggleLike} = useMutation(
    () => {
      if (!profile || !bookId) return Promise.reject();
      return api.bookLiked.toggleBookLiked(profile.id, bookId);
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
