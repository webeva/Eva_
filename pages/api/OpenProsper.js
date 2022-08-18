/* An api that will use the cloutTags api to 
fetch current trending tag, search for posts
with certain tags and more */

class OpenProsperApi {
  constructor() {
    this.BASE_URL =
      "https://openprosperapi.xyz/api/v0/p/social/trending-hashtags-x8k6jw1";
  }

  async getTrendingTags() {
    try {
      const response = await fetch(`${this.BASE_URL}`, {
        method: "GET",
      })
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
export default OpenProsperApi;
