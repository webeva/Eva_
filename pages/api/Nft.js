/* This api will fetch the top Nfts to display in the 
discover page */


class NFT {
    async getTopNft() {
        try {
          const response = await fetch(
            `https://desodata.azureedge.net/creator-extra-data/collections.json?v=2022-08-25T19:00:00.000Z`,
            {
              method: "GET",
              Headers: {
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
              },
            }
          )
            .then((res) => res.json())
            .then(function (data) {
              return data;
            });
          return response;
        } catch (error) {
          console.log(error);
          return;
        }
      }
}

export default NFT;
