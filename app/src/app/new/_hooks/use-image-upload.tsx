import { useMutation } from "@tanstack/react-query";

type ImageUploadResponse = { hash: string; url: string };

async function uploadImage(formData: FormData) {
  const response = await fetch("/api/images", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<ImageUploadResponse>;
}

export function useImageUpload() {
  return useMutation<ImageUploadResponse, Error, FormData>({
    mutationFn: uploadImage,
  });
}
