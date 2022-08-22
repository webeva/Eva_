//Import Modal
import Modal from "react-modal";
//Import style
import style from "./BuyNFTModal.module.css";
//Import atom and the modal state
import { useRecoilState } from "recoil";
import { NFTState } from "../../atom/modalAtom";

export default function BuyNFTModal() {
  //Set the state of the modal ie: open or close
  const [open, setOpen] = useRecoilState(NFTState)
  //Custom style to set the z-index of the modal
  const customStyles = {
    overlay: {
      background: "rgba(0,0,0,0.8)",
      zIndex: 1000,
    }
  };
  //Return the html
  return (
    <Modal
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      ariaHideApp={false}
      style={customStyles}
      className={style.modal}
    >
      <h1>Buy NFTs</h1>
      <h2>Feature Launching Soon...</h2>
      <p>In the meanwhile you can buy it on Nftz.me at </p>
      
    </Modal>
  );
}
