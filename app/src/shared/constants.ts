import { base, baseSepolia } from "viem/chains";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const APP_CHAIN = process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? base : baseSepolia;
