"use client";

export default function CarExplorerHotkeys() {
  return (
    <div className="ce-hotkeys">
      <div className="ce-hotkey">
        <span className="ce-key">E</span> EXPLODE
      </div>
      <div className="ce-hotkey">
        <span className="ce-key">R</span> RESET
      </div>
      <div className="ce-hotkey">
        <span className="ce-key">X</span> X-RAY
      </div>
      <div className="ce-hotkey">
        <span className="ce-key">1-7</span> SELECT PART
      </div>
      <div className="ce-hotkey">
        <span className="ce-key">ESC</span> DESELECT
      </div>
    </div>
  );
}
