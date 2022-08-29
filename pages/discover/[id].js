/* This is a dynamic url that loads content 
based on the parameters given. This page shows
the searchbar with the content provided in the 
url. For example going to /eva will enter eva 
into the searchbar */

import SearchBar from "../../components/SearchBar";
export default function Discover() {
  return (
    <>
      <SearchBar></SearchBar>
    </>
  );
}
