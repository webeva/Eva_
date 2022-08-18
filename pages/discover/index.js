/* This is the main page for the discovery 
section. This page shows trending tags, a
search bar and features an event. Is loaded
even if the user is not logged in */


import SearchBar from "../../components/SearchBar"
import { useRouter } from "next/router";
import style from "../../styles/Search.module.css"
import OpenProsperApi from "../api/OpenProsper";
export default function Discover({trending}) {
    const router = useRouter()   
    function search(id){
      router.push("/search/post/" + id)
    }
    return ( 
      <>
      {/* Search bar */}
      <SearchBar></SearchBar>
      <div className={style.mainWindow}>
        {/* The banner image */}
        <img loading="eager" rel="preload" src="/images/Introducing Eva.webp" className={style.banner} alt="Introducing Eva"/>
        <main className={style.trending}>
          <h2>Trending Tags</h2>
          {/* If we have trending tags map over them */}
          {trending?.map(function(value){
            {/* Deconstruct the value we need */}
            const {Hashtag, Count} = value
            return <div className={style.tag}  key={Hashtag} onClick={() => search(Hashtag.substring(1))}>
              {Hashtag}<br></br>
              {Count} posts
              <br></br>
              </div>
          })}
        </main>
      </div>
      </>
    )
  }
  export async function getStaticProps() {
    const OpenProsper = new OpenProsperApi()
    const response = await OpenProsper.getTrendingTags();
    const trending = response.value.Hours24.Top10Hashtags
    return {
      props: {
        trending,
      }
    }
  }
  