import React, {useState, useRef, useMemo} from "react";
import {useNavigate} from 'react-dom'
import { Canvas, useFrame, useThree } from "react-three-fiber";
import * as THREE from 'three'
import { OrbitControls, Stars } from "drei";
import { Physics, usePlane, useBox } from "use-cannon";
import scp from './Roboto2.json'
import "./styles.css";


function TextMesh(props) {
  // parse JSON file with Three
  const font = new THREE.FontLoader().parse(scp);

  const [ref, api] = useBox(() => ({ mass: 1, position: [-10, 14, -12] }));
  // configure font geometry
  const textOptions = {
    font,
    size: 1,
    height: 0.5
  };

  return (
    <mesh position={[0, 2, 0]} ref={ref} onClick={()=>{
                                                        api.velocity.set(0,10,0,)
                                                        props.setWords(["I Make Things Interactive"])    
                                                                                }}>
      <textGeometry attach='geometry' args={[props.word, textOptions]} />
      <meshStandardMaterial attach='material' color='hotpink' />
    </mesh>
  )
}
function Box() {
  const [ref, api] = useBox(() => ({ mass: 1, position: [200, 1000, 300] }));
  return (
    <mesh
      onClick={() => {
        api.velocity.set(0, 2, 0);
      }}
      ref={ref}
      position={[0, 2, 0]}
    >
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
}

function Plane() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshLambertMaterial attach="material" color="lightblue" />
    </mesh>
  );
}


function Dolly() {
  // This one makes the camera move in and out
  useFrame(({ clock, camera }) => {
    camera.position.z = 70 + Math.sin(clock.getElapsedTime()) * 30
  })
  return null
}

export default function App(){ 
    const [words, setWords] = useState(["SEB WEBBER: CREATIVE GENIUS"])
    
    const handleChange = (e) => {
        setWords(e.target.value.split(" "))
        console.log(words)
    
    }
    return (<>
      <div style={{}}>
      <form>
        <input defaultValue='Start Typing Here' type="text" name="name" style={{background:"black",borderRadius:"40px",color:"white", fontSize:"35px" ,height:"40px"}} onChange={handleChange} autoFocus/>
      </form>
      </div>
      <Canvas style={{height:"90vh", width:"100vw", marginTop:"40px"}}>
      <OrbitControls />
      <Stars />
      <ambientLight intensity={0.3} />
      <spotLight position={[40, 11, 15]} angle={0.8} />
      <Physics>
        {
          words.map((word)=> {
              setTimeout(2000) 
              return <TextMesh word={word} setWords={setWords}/>

          })  
        }
      <Plane />
      </Physics>
    </Canvas>
  </>);
}
