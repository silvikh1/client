import { useEffect, useState, useRef } from 'react'
import client from 'socket.io-client';

const socket = client.io('https://server-deploy-1d16.onrender.com')


function App() {
  const [count, setCount] = useState(0)
  const [allUsers, setAllUsers] = useState({});
  const [width, setWidth] = useState(38);
  const enemiesCounts = Object.values(allUsers);
  const trackRef = useRef(null)

  const pxPerTile = width / 30


  useEffect(() => {
    socket.on('update-count',  (serverAllUsers) => {
     console.log('update-count', socket.id, serverAllUsers);
     const currentUserCount = serverAllUsers[socket.id];
     setCount(currentUserCount);
     delete serverAllUsers[socket.id];
     setAllUsers(serverAllUsers);
    });

    socket.on('winner', (winnerid) => {
      if (winnerid === socket.Id){
        alert ('game over, you win')
        return;
      }
      alert('Game over')
    })

    return () => {
      socket.off('update-count');
       socket.off('winner')
    };
  }, []);

  const handleButtonClick = () => {
    socket.emit('increase-count');
  }

  useEffect( () => {
    const resizeObserver = new ResizeObserver(({entry}) => {
      setWidth(entry.contentRect.width);
    });
    if(trackRef.cuurent)resizobserver.observe(trackRef.current);
    return () => resizeObserver.disconnect();
  },[])

  

  return (
    <div style={{ width: '100vw' }} ref={trackRef}>
      <div
       style={{
         width: '100px',
         height: '100px',
         position: 'relative',
         left:`calc(${(count / 30) * 100}%)`,
         marginBotton: '10px',
         backgroundColor: 'pink',
         transition: `left ${pxPerTile * 3}ms linear`,
        }}
      />
      {enemiesCounts.map((count,index) => (
       <div
       style={{
        width: '100px',
        height: '100px',
        position: 'relative',
        left:`calc(${(count / 30) * 100}%)`,
        marginBotton: '10px',
        backgroundColor: 'pink',
        transition: `left ${pxPerTile * 3}ms linear`,
       }}
         key={index}
        />
      ))}
     <div className="card">
        <button onClick={handleButtonClick}>
         Click to increase count
        </button>
      </div>
    </div>
    
    
  )
}

export default App

