import { PinataFileUploadRes } from "@/shared/types/ipfs";
import { useMutation } from "@tanstack/react-query";

async function uploadImage(formData: FormData) {
  const response = await fetch("/api/images", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<PinataFileUploadRes>;
}

export function useImageUpload() {
  return useMutation<PinataFileUploadRes, Error, FormData>({
    mutationFn: uploadImage,
  });
}
