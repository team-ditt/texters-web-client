import {api} from "@/api";
import {keys} from "@/constants";
import {useDidSignIn} from "@/features/Auth/hooks";
import {Profile} from "@/types/member";
import {UseQueryOptions, useQuery} from "@tanstack/react-query";

export default function useProfile({
  refetchOnWindowFocus = false,
  retry = false,
  ...options
}: UseQueryOptions<Profile, unknown, Profile, string[]> = {}) {
  const didSignIn = useDidSignIn();
  // const {data: profile, ...useQueryResult} = useQuery(
  //   [keys.GET_MY_PROFILE],
  //   api.members.fetchProfile,
  //   {
  //     enabled: didSignIn,
  //     refetchOnWindowFocus,
  //     retry,
  //     ...options,
  //   },
  // );

  return {profile: {penName: "작가"}};
}
