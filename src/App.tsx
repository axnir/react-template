import React, { FC, useState } from 'react';

const App: FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{display: 'flex', flexDirection: "column", alignItems: "center"}}>
      <h1 style={{textAlign: 'center', fontSize: 28, color: "orange"}}>react-with-esbuild-cli</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>👍+1</button>
    </div>
  )
}

export default App;