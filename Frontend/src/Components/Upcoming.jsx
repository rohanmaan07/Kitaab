import React from 'react';

function Upcoming() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000" 
      }}
    >
      <video style={{ maxWidth: "100%", maxHeight: "100%", height: "auto" }} controls>
        <source src="Upcoming.mp4" type="video/mp4" />
        
      </video>
    </div>
  );
}

export default Upcoming;
