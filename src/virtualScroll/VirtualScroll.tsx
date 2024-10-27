import React, { ForwardedRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { DynamicHeight, VirtualScrollProps } from "./VirtualScroll.types";
import Shimmer from "./Shimmer";

let prevIndex = 0;
let prevTime = new Date().getTime();
let prevScrollTop = 0;
let scrollTimer: ReturnType<typeof setTimeout> | null = null;
const SCROLL_SPEED = 2.5; // Ideal value selected after testing.
const ERROR_PIXELS = 1; // To fix the issue where somtimes the scroll bottom event is not triggered.

const StyledVirtualScroll = styled.div<{
  $width: string | number | undefined;
}>`
  &.virtualscroll {
    width: ${(props) =>
      typeof props.$width === "number"
        ? `${props.$width}px`
        : props.$width || "100px"};
  }
`;

const StyledDynamicHeight = styled.div<DynamicHeight>`
  height: ${(props) => props.height};
`;

const StyledDynamicPadding = styled.div``;

const StyledViewPort = styled.div<any>`
  &.virtualscroll-viewport {
    overflow-y: auto;
    height: ${(props) =>
      typeof props.$viewportHeight === "number"
        ? `${props.$viewportHeight}px`
        : props.$viewportHeight || "300px"};
  }
`;

const ViewportScroll: React.FC<VirtualScrollProps> = ({
  children,
  onScrollToBottom,
  viewportHeight,
  loadedItems,
  defaultBottomLoaderCount = 3,
  itemRefPropertyName = "ref",
  getViewportElement,
  loadingEffectOnScrolling,
  loaderOnScrollingBottom = false,
  customLoaderTemplate,
  elementHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [speedScroll, setSpeedScroll] = useState(false);
  const [childHeight, setChildHeight] = useState(0);
  const [skeletonwidth, setSkeletonwidth] = useState<number | string>();
  const [visibleItems, setVisibleItems] = useState<React.ReactNode[]>([]);
  const [hideFirstElement, sethideFirstElement] = useState(true);
  const [paddingTop, setpaddingTop] = useState<number>(0);
  const childRef = useRef<any>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  // To send back the view port reference to the parent component
  useEffect(() => {
    if (getViewportElement) {
      getViewportElement(containerRef.current!);
    }
  }, []);

  const handleScroll = () => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      const scrollTop = currentContainer.scrollTop;
      const scrollHeight = currentContainer.scrollHeight;
      const clientHeight = currentContainer.clientHeight;
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - prevTime;
      const distance = scrollTop - prevScrollTop;
      const speed = Math.abs(distance) / timeDiff;
      if (speed > SCROLL_SPEED && loadingEffectOnScrolling) {
        setSpeedScroll(true);
      } else {
        setSpeedScroll(false);
      }
      prevTime = currentTime;
      prevScrollTop = scrollTop;

      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
      // Start a new scroll timer, It will automatically stops speedscroll, when user drag the scroll manually
      scrollTimer = setTimeout(() => {
        // Handle scroll stop logic here
        setSpeedScroll(false);
      }, 250); // Adjust
      if (
        scrollTop + clientHeight + (loadedItems || 15) * childHeight >
        scrollHeight
      ) {
        setSpeedScroll(false);
      }

      if (
        scrollHeight - scrollTop - ERROR_PIXELS <= clientHeight &&
        !scrolledToBottom
      ) {
        if (onScrollToBottom && Array.isArray(children)) {
          onScrollToBottom();
          setScrolledToBottom(true);
        } else {
          return;
        }
      }
      const newStartIndex = Math.floor((scrollTop + 10) / childHeight);
      setStartIndex(newStartIndex);
      prevIndex = newStartIndex;
    }
  };

  useEffect(() => {
    setScrolledToBottom(loaderOnScrollingBottom);
  }, [loaderOnScrollingBottom]);

  // to avoid re-render issue (useEffect is changing repetitive), creating the container height as let.
  let containerHeight;
  if (Array.isArray(children)) {
    containerHeight = children.length * childHeight;
  }

  useEffect(() => {
    // Cleanup function to clear the scroll timer on component unmount
    return () => {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (childRef.current) {
      const height = childRef.current["offsetHeight"];
      const width = childRef.current["offsetWidth"];
      setChildHeight(elementHeight);
      setSkeletonwidth(width - 30);
      sethideFirstElement(false);
    }
  }, [children]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer && children) {
      const visibleCount = Math.ceil(loadedItems || 30);
      const newVisibleItems = React.Children.toArray(children).slice(
        startIndex,
        startIndex + visibleCount
      );
      setVisibleItems(newVisibleItems);
    }
    const paddingTop = startIndex * childHeight;
    setpaddingTop(paddingTop);
  }, [startIndex, children]);

  return (
    <StyledViewPort
      className={"virtualscroll-viewport"}
      ref={containerRef}
      onScroll={handleScroll}
      $viewportHeight={viewportHeight}
    >
      <StyledDynamicHeight height={containerHeight + "px"}>
        <StyledDynamicPadding style={{ paddingTop: paddingTop + "px" }}>
          {hideFirstElement &&
            React.Children.map(children, (child, index) => {
              if (index === 0) {
                return React.cloneElement(child as React.ReactElement, {
                  [itemRefPropertyName]: childRef, // Assign ref to the first child, to calculate the height of single element
                });
              }
              return null;
            })}
          {!speedScroll &&
            Object.entries(visibleItems).map(([key, value], index) => (
              <div key={index}>{value}</div>
            ))}

          {speedScroll && (
            <>
              {Array.from({ length: loadedItems || 15 }, (_, index) => (
                <Shimmer
                  m={4}
                  key={index}
                  height={childHeight}
                  width={skeletonwidth}
                ></Shimmer>
              ))}
            </>
          )}

          {loaderOnScrollingBottom && !customLoaderTemplate && (
            <>
              {Array.from({ length: defaultBottomLoaderCount }, (_, index) => (
                <Shimmer
                  m={4}
                  key={index}
                  height={childHeight}
                  width={skeletonwidth}
                ></Shimmer>
              ))}
            </>
          )}
          {loaderOnScrollingBottom &&
            !!customLoaderTemplate &&
            customLoaderTemplate}
        </StyledDynamicPadding>
      </StyledDynamicHeight>
    </StyledViewPort>
  );
};

const VirtualScroll: React.FC<VirtualScrollProps> = React.forwardRef(
  (
    {
      onScrollToBottom,
      children,
      viewportHeight,
      className,
      width,
      loadedItems,
      defaultBottomLoaderCount = 0,
      itemRefPropertyName = "ref",
      getViewportElement,
      loadingEffectOnScrolling = true,
      loaderOnScrollingBottom = false,
      customLoaderTemplate,
      elementHeight,
    },
    ref?: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <StyledVirtualScroll
        data-testid="VirtualScroll"
        className={` virtualscroll ${className ? className : ""}`}
        $width={width}
        ref={ref}
      >
        <ViewportScroll
          elementHeight={elementHeight}
          onScrollToBottom={onScrollToBottom}
          viewportHeight={viewportHeight}
          loadedItems={loadedItems}
          defaultBottomLoaderCount={defaultBottomLoaderCount}
          itemRefPropertyName={itemRefPropertyName}
          getViewportElement={getViewportElement}
          loadingEffectOnScrolling={loadingEffectOnScrolling}
          loaderOnScrollingBottom={loaderOnScrollingBottom}
          customLoaderTemplate={customLoaderTemplate}
        >
          {children}
        </ViewportScroll>
      </StyledVirtualScroll>
    );
  }
);

export default VirtualScroll;
