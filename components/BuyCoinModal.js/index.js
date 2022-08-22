//Import Modal
import Modal from "react-modal";
//Import style
import style from "./BuyCoinModal.module.css";
//Import atom and the modal state
import { useRecoilState } from "recoil";
import { CreatorState } from "../../atom/modalAtom";

export default function BuyCoinModal() {
  //Set the state of the modal ie: open or close
  const [open, setOpen] = useRecoilState(CreatorState);
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
      <h1>Buy Creator Coin</h1>
      <h2>Feature Launching Soon...</h2>
    </Modal>
  );
}
