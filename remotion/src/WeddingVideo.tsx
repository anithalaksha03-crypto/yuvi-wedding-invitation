import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const WeddingVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#041713",
        color: "#f4db8b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontSize: 48,
        textAlign: "center",
      }}
    >
      <div>YUVI STUDIO</div>
      <div style={{ marginTop: 24 }}>
        Wedding Invitation
      </div>
      <div style={{ marginTop: 32, fontSize: 24 }}>
        {Math.floor(frame / 30) + 1}
      </div>
    </AbsoluteFill>
  );
};
