/*
curl -X 'GET' \
  'https://deep-index.moralis.io/api/v2/0xb39bebc396c0849d1f894efb9037b76640fff9ce/nft?chain=mumbai&format=decimal' \
  -H 'accept: application/json' \
  -H 'X-API-Key: EgaLxSjdg6VD95EdJuk02idFwT1OjxXzYZ1tl6vXslzrBc34iwWbqb94jh04lqhn'
 */

// Chain could be polygon, mumbai

/**
 * chainId is the id of the chain
 * keyword is the keyword to search for, required at least 3 characters
 * return
 */
export const getNftsByAddress = async ({ chain = "mumbai", address } = {}) => {
  // TODO Address validation
  if (!address) {
    return null;
  }
  const resp = await fetch(`https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&format=decimal`, {
    headers: {
      accept: "application/json",
      "X-API-Key": "EgaLxSjdg6VD95EdJuk02idFwT1OjxXzYZ1tl6vXslzrBc34iwWbqb94jh04lqhn",
    },
  })
    .then(res => res.json())
    .catch(e => {
      console.log("Error on get Nfts by address", e);
    });
  if (resp) {
    const result = await resolveResultAsync(resp?.result ?? []);
    return { ...resp, result };
  }
};

const resolveResultAsync = result => {
  return Promise.all(result?.map(async nft => ({ ...nft, metadata: await parseMetadataAsync(nft) })));
};

const parseMetadataAsync = async token => {
  const metadataString = token.metadata;
  let metadata = {};
  try {
    const meta = JSON.parse(metadataString) ?? {};
    // const token_uri = meta.token_uri ?? token.token_uri;
    // It could be store in the 'data' field
    // const normalizedData = meta.data ?? (await getMetaIfTokenUri(token_uri)) ?? meta;
    // const image = resolveIPFS(normalizedData?.image);
    metadata = { ...meta };
  } catch (e) {}

  return { ...token, metadata };
};

const getMetaIfTokenUri = async tokenUri => {
  if (!tokenUri) return;
  try {
    return await (await fetch(tokenUri)).json();
  } catch (e) {
    // do nothing
    return;
  }
};
