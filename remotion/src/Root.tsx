import React from "react";
import { Composition } from "remotion";
import { WeddingVideo } from "./WeddingVideo";

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
