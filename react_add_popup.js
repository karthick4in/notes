import { render } from "react-dom";
import { useRef } from "react";
import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [popups, setPopups] = useState([]);
  const [nextId, setNextId] = useState(1);

  const addPopup = () => {
    setPopups([...popups, { id: nextId, message: `This is popup ${nextId}` }]);
    setNextId(nextId + 1);
  };

  const removePopup = (id) => {
    setPopups(popups.filter((popup) => popup.id !== id));
  };

  return (
    <div className="App">
      <button className="add-button" onClick={addPopup}>
        Add Popup
      </button>
      {popups.map((popup) => (
        <DraggablePopup
          key={popup.id}
          id={popup.id}
          message={popup.message}
          onClose={removePopup}
        />
      ))}
    </div>
  );
};
const DraggablePopup = ({ id, message, onClose }) => {
  const inputElement = useRef();

  const focusInput = () => {
    inputElement.current.focus();
  };
  useEffect(() => {
    console.log("mydiv_" + id);
    dragElement(id);
  }, []);
  return (
    <>
      <div id={"mydiv_" + id} class="mydiv">
        <div id={"mydivheader_" + id} className="mydivheader">
          Click here to move
        </div>
        <p>Move {id}</p>
        <p>this</p>
        <p>DIV</p>
      </div>
    </>
  );
};

export default App;

const rootElement = document.getElementById("root");
render(<App />, rootElement);

// dragElement(document.getElementById("mydiv"));

function dragElement(elmntID) {
  let elmnt = document.getElementById("mydiv_" + elmntID);
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  if (document.getElementById("mydivheader_" + elmntID)) {
    // if present, the header is where you move the DIV from:
    document.getElementById("mydivheader_" + elmntID).onmousedown =
      dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/*

#mydiv,
.mydiv {
  position: absolute;
  z-index: 9;
  background-color: #f1f1f1;
  text-align: center;
  border: 1px solid #d3d3d3;
}

#mydivheader,
.headerClass,
.mydivheader {
  padding: 10px;
  cursor: move;
  z-index: 10;
  background-color: #2196f3;
  color: #fff;
}


*/
