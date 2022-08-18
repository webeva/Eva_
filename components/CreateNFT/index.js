import Modal from "react-modal"
import { useRecoilState } from "recoil";
import { CreateNftState , createNftHash} from "../../atom/modalAtom";
import style from "./createNFT.module.css"
import { useState, useEffect} from "react";
import DesoApi from "../../Functions/Desoapi";

export default function CreateNft() {
    const [open, setOpen] = useRecoilState(CreateNftState)
    const [postHash] = useRecoilState(createNftHash)
    const [supply, setSupply] = useState(1)
    const [desoPrice, setDesoPrice] = useState(1)
    useEffect(()=>{
        setDesoPrice(localStorage.getItem("desoPrice"))
    }, [])
    const deso = new DesoApi()
    const customStyles = {
        overlay: {zIndex: 1000},  
    };
    async function createNft(){
        let UpdaterPublicKeyBase58Check = localStorage.getItem("deso_user_key")
        let NumCopies = supply
        let Price = document.getElementById("price").value
        let NFTRoyaltyToCreatorBasisPoints = document.getElementById("yourRoyalty").value * 100;
        let NFTRoyaltyToCoinBasisPoints = document.getElementById("coinRoyalty").value * 100;
        let HasUnlockable = false
        let IsForSale = true
        let MinFeeRateNanosPerKB = 1000;
        if(Price == 0 || NumCopies == 0 || NFTRoyaltyToCoinBasisPoints == 0  || NFTRoyaltyToCreatorBasisPoints==0){
            alert("Value cannot be empty")
            return
        }
        if(NFTRoyaltyToCoinBasisPoints > 10000 || NFTRoyaltyToCreatorBasisPoints > 10000){
            alert("Royalty cannot be greater than 100%")
            return
        }
        if(postHash){
            const response = deso.createNft(UpdaterPublicKeyBase58Check, postHash, NumCopies, NFTRoyaltyToCreatorBasisPoints, NFTRoyaltyToCoinBasisPoints, HasUnlockable, IsForSale, Price, MinFeeRateNanosPerKB)
            setOpen(false)
        }else{
            alert("An error has occured. Please reopen this modal")
            return
        }
        
        
    }
  return (
    <Modal  className={style.modal} ariaHideApp={false} style={customStyles} isOpen={open} onRequestClose={()=> {setOpen(false)}}>
        <div >
        <h2>Create an NFT</h2>
        <h5 style={{ paddingLeft: "30px",paddingRight: "30px", fontSize:"14px"}}>An Nft is an online asset that can be sold or bought. It can be used to prove ownership over artwork, music, collectibles or posts! </h5>
        <div className={style.line}></div>
        <div style={{textAlign:"left", marginLeft:"1vw"}}>
            {/* Supply */}
            <h3 style={{lineHeight:"0px"}}>Supply</h3>
            <p className={style.muted}>The supply controls the number of NFTs.</p>
            <input onChange={(e)=> setSupply(e.target.value)} value={supply} type="number" min={1} className={style.input} placeholder="Number of NFTS"></input>
            <p >Network fee: {Number(0.00001 * supply).toFixed(3)} Deso (~$  {Number((0.0001 * supply) * desoPrice).toFixed(2)})</p>
            

            {/* Price */}
            <div className={style.line}></div>

            <h3 style={{lineHeight:"0px"}}>Price</h3>
            <p className={style.muted}>The minimal bidding price in Deso</p>
            <div className={style.inputDiv}>
                Deso
                <input id="price" min={1} type="number" style={{padding:"5px 8px"}}></input>
                </div>
            

            {/* Royalty */}<br></br>
            <div className={style.line}></div>

            <h3 style={{lineHeight:"0px"}}>Royalties</h3>
            <p className={style.muted}>After every sale or resale a certain percentage goes to you and to people that hold your coin.</p>
            <span style={{display:"inline-block", marginLeft:"0.1vw", marginTop:"0.3vw"}}>
            % Your Royalty<br></br>
            <input id="yourRoyalty" min={0} max={100} type="number"  className={style.input}></input>
            </span>
            <span style={{display:"inline-block", marginLeft:"13vw"}}>
            % Coin-Holder Royalty<br></br>
            <input id="coinRoyalty" min={0} max={100} type="number"  className={style.input}></input>
            </span><br></br><br></br>
            <div className={style.line}></div>
            <button onClick={()=> createNft()} className={style.button}>Create NFT</button>
        </div>
        </div>
       
            
    </Modal>
  )
}
