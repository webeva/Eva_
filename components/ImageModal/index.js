//Import Modal
import Modal from "react-modal";
//Import atom and the modal state
import { useRecoilState } from "recoil";
import { ImageModalState, ImageSrc } from "../../atom/modalAtom";
//Import style
import style from "./ImageModal.module.css"
export default function ImageModal() {
  //Set the state of the modal ie: open or close
  const [open, setOpen] = useRecoilState(ImageModalState);
  const [src] = useRecoilState(ImageSrc)
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
        <img className={style.image} src={src}></img>
      
    </Modal>
  );
}
