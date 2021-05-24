import { useMutation } from "@apollo/client";
import { Manga } from "types";
import FollowMangaMutation from "./mutations/FollowManga";
import UnfollowMangaMutation from "./mutations/UnfollowManga";

export default function useFollowManga(manga: Manga) {
  const [followManga, followResult] = useMutation(FollowMangaMutation, {
    variables: { mangaId: manga.id },
  });
  const [unfollowManga, unfollowResult] = useMutation(UnfollowMangaMutation, {
    variables: { mangaId: manga.id },
  });

  return {
    follow: { followManga, result: followResult },
    unfollow: { unfollowManga, result: unfollowResult },
  };
}
