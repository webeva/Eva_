import { useRecoilState } from "recoil";
import Modal from "react-modal";
import { EditState, EditStateHash } from "../../atom/modalAtom";
import InputField from "../InputField";
import style from "../CommentModal/Modal.module.css";

export default function EditPost() {
  const [open, setOpen] = useRecoilState(EditState);
  const [postHash, setPostHash] = useRecoilState(EditStateHash);

  const customStyles = {
    overlay: {
      background: "rgba(0,0,0,0.8)",
      zIndex: 1000,
    }
  };
  return (
    <Modal
      className={style.modal}
      ariaHideApp={false}
      style={customStyles}
      isOpen={open}
      onRequestClose={() => {
        setOpen(false);
        setPostHash(null);
      }}
    >
      <InputField community=""></InputField>
    </Modal>
  );
}
