/* The search bar used to search through Eva. 
The searchbar redirects the user to the appropriate
page depending on what they searched and if they
searched it in posts or people. */

//Import the style
import style from "../../styles/Discover.module.css";
//Import nextjs's router
import { useRouter } from "next/router";
//Import useState and useEffect
import { useState, useEffect } from "react";
//Import cloutTag for relevant search keywords
import CloutTagsApi from "../../pages/api/CloutTags";

//Export the search bar
export default function SearchBar() {
  //Set up nextjs's router
  const router = useRouter();
  //Get the current page's link or the search temr
  const { id } = router.query;
  const [searchValue, setSearchValue] = useState();
  //Set up the clout tag api 
  const clout = new CloutTagsApi();
  const [relevantTags, SetRelevantTags] = useState([]); /* Relevant search tags */

  //Set the search term to the cureent page id
  useEffect(() => {
    setSearchValue(id);
  
    //Function that hides the autocomplete box if the user clicks outside of it
    document.addEventListener("click", function (e) {
      try {
        if (document.getElementById("autocompletebox")) {
          if (!document.getElementById("autocompletebox").contains(e.target)) {
            document.getElementById("autocompletebox").style.display = "none";
            document.getElementById("autocompletebox").style.opacity = "0";
          }
        }
      } catch (error) {
        //Returns if an error is caught
        return;
      }
    });
  }, [id]);


  useEffect(() => {
    if (searchValue) {
      if (searchValue.length > 0) {
        document.getElementById("autocompletebox").style.display = "block";
        document.getElementById("autocompletebox").style.opacity = "1";
        getRelevantTags(searchValue);
      }
    } else {
      document.getElementById("autocompletebox").style.display = "none";
      document.getElementById("autocompletebox").style.opacity = "0";
    }
  }, [searchValue]);

  //Reroute the people search page with the current search term
  function searchPeople(id) {
    router.push(`/search/people/${id.searchValue}`);
  }
  //Reroute tp the post search page with the current search term
  function searchPost(id) {
    router.push(`/search/post/${id.searchValue}`);
  }
  function searchCommunity(id){
    router.push(`/search/community/${id.searchValue}`)
  }
  //Reroute to the post search page with the relevant search term
  function searchCloutPost(id) {
    router.push(`/search/post/${id}`);
  }

  //Get the relevant tags when user types
  async function getRelevantTags(search) {
    const result = await clout.getRelevantSearch(search);
    SetRelevantTags(result);
  }

  //Return the search bar jsx
  return (
    <>
      <div className={style.wrapper}>
        <div className={style.searchInput}>
          <input
            maxLength={60}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchPost({ searchValue })}
            type="text"
            placeholder="Type to search Eva"
          ></input>
          <div id="autocompletebox" className={style.autocompleteBox}>
            <li onClick={() => searchPost({ searchValue })}>
              Search <strong>{searchValue}</strong> in Posts
            </li>
            <li onClick={() => searchPeople({ searchValue })}>
              Search <strong>{searchValue}</strong> in People
            </li>
            <li onClick={() => searchCommunity({ searchValue })}>
              Search <strong>{searchValue}</strong> in Community
            </li>
            {relevantTags.length > 0 &&
              relevantTags.map(function (value) {
                const { clouttag } = value;
                return (
                  <li key={clouttag} onClick={() => searchCloutPost(clouttag)}>
                    {" "}
                    # {clouttag}
                  </li>
                );
              })}
          </div>
          <div
            onClick={() => searchPost({ searchValue })}
            className={style.icon}
          >
            <img
              src="/Svg/search.svg"
              width={23}
              height={23}
              alt="search"
            ></img>
          </div>
        </div>
      </div>
    </>
  );
}
//End of the search bar component 