import React, { FC, useState } from 'react';
import './App.scss';

const App: FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1 className="title">react-with-esbuild-cli</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>👍+1</button>
    </div>
  )
}

export default App;