/* An api that will use the cloutTags api to 
fetch current trending tag, search for posts
with certain tags and more */

class CloutTagsApi {
  constructor() {
    this.BASE_URL =
      "https://ancient-reef-76919.herokuapp.com/https://api.cloutapis.com";
  }

  async getTrendingTags() {
    try {
      const response = await fetch(`${this.BASE_URL}/clouttags/trending`, {
        method: "GET",
        Headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        },
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

  async getRelevantSearch(search) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/clouttags/search/${search}`,
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
export default CloutTagsApi;
