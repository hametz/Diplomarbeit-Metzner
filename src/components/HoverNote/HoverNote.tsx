import Icon from "../../assets/img/chevron_top_white.webp";
import { useMediaQuery } from "react-responsive";

function HoverNote() {
  const isMobile = useMediaQuery({ query: "(max-width: 50em)" });

  const handleClick = (target: HTMLElement) => {
    let hoverNote: HTMLElement | null = target;

    if (hoverNote.className !== "hover-note") {
      hoverNote = hoverNote.parentElement;
    }

    if (hoverNote) {
      const hoverNoteState = hoverNote.getAttribute("data-type");

      if (hoverNoteState !== "hide") {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      {isMobile ? (
        <></>
      ) : (
        <div
          className="hover-note"
          onClick={(e) => handleClick(e.target as HTMLElement)}>
          <img className="hover-note-icon" src={Icon} alt="Nach Unten"></img>
        </div>
      )}
    </>
  );
}

export default HoverNote;
