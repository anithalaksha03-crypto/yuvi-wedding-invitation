import React from "react";
import { Composition } from "remotion";

const WeddingVideo: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#041713",
        color: "#f4db8b",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 48,
        textAlign: "center",
      }}
    >
      YUVI STUDIO
      <br />
      Wedding Invitation
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WeddingInvitation"
      component={WeddingVideo}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
