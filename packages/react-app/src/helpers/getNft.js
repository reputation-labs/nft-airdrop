import uniqBy from "lodash.uniqby";

/**
 * chainId is the id of the chain
 * keyword is the keyword to search for, required at least 3 characters
 * return
 */
export const getNfts = async ({ chain = "polygon", keyword } = {}) => {
  if (keyword?.length < 3) {
    return null;
  }
  const resp = await fetch(
    `https://deep-index.moralis.io/api/v2/nft/search?chain=${chain}&format=decimal&q=${keyword}&filter=name%2Cdescription%2Cattributes`,
    {
      headers: {
        accept: "application/json",
        "X-API-Key": "EgaLxSjdg6VD95EdJuk02idFwT1OjxXzYZ1tl6vXslzrBc34iwWbqb94jh04lqhn",
      },
    },
  )
    .then(res => res.json())
    .catch(e => {
      console.log("Error on get Nfts by chain", e);
    });
  if (resp) {
    const filteredResult = uniqBy(resp?.result ?? [], nft => nft.token_address);
    const result = await resolveResultAsync(filteredResult);
    return { ...resp, result };
  }
};

const resolveResultAsync = result => {
  return Promise.all(result?.map(async nft => ({ ...nft, metadata: await parseMetadataAsync(nft.metadata) })));
};

const parseMetadataAsync = async metadataString => {
  try {
    const meta = JSON.parse(metadataString) ?? {};
    let normalizedData = meta;
    if (typeof meta.data === "object") {
      normalizedData = meta.data;
    }
    const image = resolveIPFS(normalizedData?.image);
    return { ...normalizedData, image };
  } catch (e) {
    return {};
  }
};

const IPFS_ROOT = "https://gateway.ipfs.io/ipfs/";

export const resolveIPFS = url => {
  if (!url) {
    return url;
  }

  if (!url.includes("ipfs://") || !url) {
    return url;
  }

  return url.replace("ipfs://", IPFS_ROOT);
};
