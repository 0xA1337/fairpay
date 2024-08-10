export function buildIpfsUrl(hash?: string) {
  const defaultHash = "QmahtmC5tLALkxbwDCfvXCgyFvJd9UyZdDEgtRkDwy2o6B";
  return `https://${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${hash || defaultHash}`;
}
