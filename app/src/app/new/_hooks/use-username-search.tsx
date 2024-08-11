import { SearchedUser } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";

async function fetchUsersByUsername(username: string): Promise<SearchedUser[]> {
  try {
    if (!username) return [];
    const response = await fetch(`/api/users?username=${username}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json() as Promise<SearchedUser[]>;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function useUserByUsername(username: string) {
  const debouncedUsername = useDebounce(username, 200);

  return useQuery<SearchedUser[], Error>({
    queryKey: ["user", username],
    queryFn: () => fetchUsersByUsername(username),
    enabled: !!debouncedUsername,
  });
}
