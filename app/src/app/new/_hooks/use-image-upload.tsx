import { useMutation } from "@tanstack/react-query";

async function uploadImage(formData: FormData) {
  const response = await fetch("/api/images", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<{ url: string }>;
}

export function useImageUpload() {
  return useMutation<{ url: string }, Error, FormData>({
    mutationFn: uploadImage,
  });
}
