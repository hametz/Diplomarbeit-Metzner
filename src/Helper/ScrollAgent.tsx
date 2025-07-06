import React from "react";

export class ScrollAgent extends React.Component {
  componentDidMount() {
    const hoverNote = window.document.getElementsByClassName("hover-note")[0];

    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (document.body.scrollHeight > 200) {
        console.log("Einblenden");
      }

      if (
        document.body.scrollTop > 30 ||
        document.documentElement.scrollTop > 30
      ) {
        hoverNote.setAttribute("data-type", "hide");
      } else {
        hoverNote.removeAttribute("data-type");
      }
    }
  }

  render() {
    return <></>;
  }
}

export default ScrollAgent;
