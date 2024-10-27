// Generated with util/create-component.js
import React from "react";
import styled from "styled-components";

interface LoaderProps {
  size?: number;
  className?: string;
  color?: string;
  text?: string;
  width?: string | number;
  height?: string | number;
  border?: string | number;
  m?: string | number;
  $borderRadius?: string | number; // Border radius of the skeleton block
  $animationDuration?: string | number; // Duration of the animation
  $backgroundColor?: string; // Background color of the skeleton block
}

const StyledShimmer = styled.div<LoaderProps>`
  height: ${(props) =>
    typeof props.height === "number"
      ? `${props.height}px`
      : props.height || "50px"};

  border-radius: ${(props) =>
    props.$borderRadius
      ? typeof props.$borderRadius === "number"
        ? `${props.$borderRadius}px`
        : props.$borderRadius
      : "10px"};

  width: ${(props) =>
    typeof props.width === "number"
      ? `${props.width}px`
      : props.width || "180px"};
  background: linear-gradient(to right, #f6f7f8 8%, #eaebed 18%, #f6f7f8 33%);
  //for white background, this is the best color
  background-size: 1000px 100%;
  /* here the style is fixed, By having a large enough background size ,
    the linear gradient can smoothly move from left to right, 
    and 100% is to cover the entire height of the element*/
  animation: shimmer
    ${(props) =>
      props.$animationDuration !== undefined
        ? typeof props.$animationDuration === "number"
          ? `${props.$animationDuration}s`
          : props.$animationDuration
        : "1.5s"}
    infinite linear;
  margin: ${(props) =>
    props.m !== undefined
      ? typeof props.m === "number"
        ? `${props.m}px`
        : props.m
      : "0"};

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  //At 0%, gradient starts 1000px left (-ve); at 100%, shifts right with 1000px (+ve), creating shimmer.
  //it creates the illusion of movement by smoothly transitioning, So this px is fixed
`;

const Shimmer: React.FC<LoaderProps> = ({
  m,
  $backgroundColor,
  $animationDuration,
  height,
  width,
  className,
  $borderRadius,
}) => {
  return (
    <StyledShimmer
      m={m}
      height={height}
      width={width}
      $borderRadius={$borderRadius}
      className={`loader ${className || ""}`}
      $backgroundColor={$backgroundColor}
      $animationDuration={$animationDuration}
    />
  );
};

export default Shimmer;
