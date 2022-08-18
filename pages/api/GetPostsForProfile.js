/* At the time of building this get posts from profile 
is not included in the deso npm package so we have to 
create our own api using axios. Also uses a proxy server
to get the data */

import axios from "axios";

//const DEFAULT_NODE_URL = "https://node.deso.org/api"
const DEFAULT_NODE_URL =
  "https://ancient-reef-76919.herokuapp.com/https://node.deso.org/api";
let client = null;

class GetPosts {
  constructor() {
    this.client = null;
    this.baseUrl = DEFAULT_NODE_URL;
  }

  async getPostsForPublicKey(key, user, media) {
    if (!key) {
      console.log("Key is required");
      return;
    }

    const path = "/v0/get-posts-for-public-key";
    const data = {
      PublicKeyBase58Check: key,
      NumToFetch: 20,
      ReaderPublicKeyBase58Check: user,
      MediaRequired: media,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data.Posts;
    } catch (error) {
      return null;
    }
  }

  getClient() {
    if (client) return client;
    client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Encoding": "gzip",
      },
    });
    return client;
  }
}

export default GetPosts;
