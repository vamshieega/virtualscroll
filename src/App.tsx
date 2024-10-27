import React, { useState } from "react";
import "./App.css";
import VirtualScroll from "./virtualScroll/VirtualScroll";

function App() {
  const [items, setItems] = useState<Array<string>>([]);
  const [loaderOnScrollingBottom, setLoaderOnScrollingBottom] =
    useState<boolean>(false);
  const itemsPerLoad = 20; // Number of items to load on each scroll

  // Initial load of items
  React.useEffect(() => {
    loadMoreItems();
  }, []);

  const loadMoreItems = () => {
    const newItems = Array.from(
      { length: itemsPerLoad },
      (_, index) => `Item ${items.length + index + 1}`
    );
    console.log("newItems", newItems);
    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  return (
    <div className="App">
      <VirtualScroll
        elementHeight={40}
        width={300}
        defaultBottomLoaderCount={3}
        loaderOnScrollingBottom={loaderOnScrollingBottom}
        onScrollToBottom={() => {
          console.log("reached to bottom");
          setLoaderOnScrollingBottom(true);
          setTimeout(() => {
            loadMoreItems();
            setLoaderOnScrollingBottom(false);
          }, 3000);
        }}
        viewportHeight={"300px"}
      >
        {items.map((item, index) => (
          <p style={{ padding: 0, margin: 0, height: 40 }} key={index}>
            {item}
          </p>
        ))}
      </VirtualScroll>
    </div>
  );
}

export default App;
