export function buildWarpcastIntentUrl(text: string, embeds: string[]) {
  const urlEncodedText = encodeURIComponent(text);
  const embedsQuery = embeds.map((embed) => `embeds[]=${encodeURIComponent(embed)}`).join("&");
  return `https://warpcast.com/~/compose?text=${urlEncodedText}&${embedsQuery}`;
}

export function buildXIntentUrl(text: string, url: string) {
  const urlEncodedText = encodeURIComponent(text);
  return `https://twitter.com/intent/tweet?text=${urlEncodedText}&url=${encodeURIComponent(url)}`;
}
