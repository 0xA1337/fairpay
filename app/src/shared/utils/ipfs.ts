export function buildIpfsUrl(hash: string) {
  return `https://${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${hash}`;
}
