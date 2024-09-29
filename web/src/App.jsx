import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="text-red-600">App</div>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      ;
    </>
  );
}