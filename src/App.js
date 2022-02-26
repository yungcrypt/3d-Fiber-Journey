import React, {useState, useRef, useMemo, useEffect, Suspense, useLayoutEffect} from "react";
import {useNavigate} from 'react-dom'
import { Canvas, useFrame, useThree, useLoader, extend} from "react-three-fiber";
import * as THREE from 'three'
import { OrbitControls, Stars, useCamera, CameraShake  } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import scp from './scp.blob'
import {Preload, ScrollControls, Scroll, useScroll, PerspectiveCamera } from '@react-three/drei'
import { RecoilRoot, useRecoilState, useRecoilValue, atom } from "recoil";
import {Zoom, Flash} from 'react-reveal'
import "./styles.css";
import CameraControls from 'camera-controls'
import {animated, useSpring, Transition} from 'react-spring'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

extend({ TextGeometry })

function TextMesh({ mass = 1, children, vAlign = 'center', hAlign = 'center', size = 1.5, color = '#000000', ...props }) {
  const font = useLoader(FontLoader, scp)
  const config = useMemo(
    () => ({ font,mass:1, size: 40, height: 30, curveSegments: 32, bevelEnabled: true, bevelThickness: 6, bevelSize: 2.5, bevelOffset: 0, bevelSegments: 8 }),
    [font]
  )
  const mesh = useRef({mass:1})
  useLayoutEffect(() => {
    const size = new THREE.Vector3()
    mesh.current.geometry.computeBoundingBox()
    mesh.current.geometry.boundingBox.getSize(size)
  }, [children])
  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]} >
      <mesh ref={mesh}>
        <textGeometry args={[children, config]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  )
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

    function between(x, min, max) {
  return x >= min && x <= max;
}

const stepAtom = atom({key:"step", default:0})
const wordsAtom = atom({key:"words", default:[]})
const Camera = (props) => {
  const [step, setStep] = useRecoilState(stepAtom)
  const {
  camera
} = useThree();
  const ref = useRef();
  const set = useThree((state) => state.set);
  const v = new THREE.Vector3()
  useEffect(() => void set({ camera: ref.current }), []);
  useFrame(({clock, camera}) => {
      if (camera.position.z < 850) {
          if (props.enter === false){
        camera.position.z = 70 + Math.log(clock.getElapsedTime()) * 300
          }
      }
          if (ref.current.enter === true){
          camera.position.lerp(v.set(ref.current.enter ? 0 : 0, ref.current.enter ? 0 : 0, ref.current.enter ? 0 : 10), 0.002)
          }
  });
  useEffect(() => {
  const interval = setInterval(() => {
    console.log(ref.current.position)
      if (ref.current.position.z >= 670) {
          if (step !== 1)
          setStep(1)
      }
      if (between(ref.current.position.z,600,750)) {
          if (ref.current.enter === true) {
          setStep(2)
          }
      }
      if (between(ref.current.position.z,300,330)) {
          if (ref.current.enter === true) {
          setStep(3)
          }
      }
      if (between(ref.current.position.z,90,110)) {
          if (ref.current.enter === true) {
          setStep(4)
          }
      }
      if (between(ref.current.position.z,20,50)) {
          if (ref.current.enter === true) {
          setStep(5)
          }
      }
      console.log(step)
  }, 500);
  return () => clearInterval(interval);
}, []);

  return <Suspense> 
        <perspectiveCamera ref={ref} {...props} />;
    </Suspense>
}


function Embeded(){
    let counted = -130
    let height = 20
    const [worded, setWords] = useRecoilState(wordsAtom)
    const words = useRecoilValue(wordsAtom);
    const [zoom, setZoom] = useState(false)
    const [focus, setFocus] = useState({})
    const [enter, setEnter] = useState(false)
    const step = useRecoilValue(stepAtom)
    const entered = useRef()
    const tracker = useRef(0)

    let tracked = 0
    const [stepped, setStep] = useRecoilState(stepAtom)
    const handleChange = (e) => {
        setWords(e.target.value.split(""))
        console.log(words)
    
    }
    const animate = useSpring(
           {
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
} 


    )
    const positions = []
    const getWordPosition = (word, index, tracked) => {
       let spacing = word.length * 10 + 20 + tracked
        tracked +=spacing
        return spacing
    }
    let count = 0

    return  <Suspense fallback={null}>
      <Stars />
      <ambientLight intensity={0.3} />
      <spotLight position={[40, 11, 15]} angle={0.8} />
        <Camera step={step} enter={enter} entered={entered} ref={tracker}/>
        <ScrollControls damping={4} pages={1}>

          <Scroll html>
        {step === 5 &&  <Zoom><form>
        <input 
            placeholder='LEAVE YOUR MESSAGE' 
            onKeyPress={event => (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122)} 
            type="text" 
            name="name" 
            style={{
                background:"rgba(0,0,0, 0.5)",
                textTransform:"uppercase !important", 
                borderRadius:"20px",
                color:"white", 
                fontSize:"30px",
                width:"40vw",
                position: "absolute", height:"40px" ,top:"60vh", left:"50vw", textAlign:"center"}} onChange={handleChange} autoFocus/>
      </form></Zoom>
      }
        {step === 1 && !enter && <> 
        <animated.div style={animate}>
                <Zoom>
            <h1 style={{  position: 'absolute', top: '15vh', left: '15vw', fontSize:'6vw' }}>NEVER<br/>DIE.</h1>
            <h1 style={{ position: 'absolute', top: '65vh', left: '62vw', fontSize:'4vw' }}>EXPERIENCE<br/>INTERACTIVITY</h1>
            <button className='button' onClick={()=>{setEnter(true)}}style={{ width:"70px", fontSize:"20px", color:"white",background:"none",border:"none",position: 'absolute', top: '45vh', left: '50vw' }}>ENTER</button>
                </Zoom>
        </animated.div>
        </>}
        {step === 2 && <> 
        <animated.div style={animate}>
            <Zoom >
            <h1 className="child" style={{ position:"absolute", top:"30vh", left:"15vw",transform:"Translate(-75, 0)",fontSize:"3vw",textAlign:'left', width:"80vw"}}>
                WE WANTED OUR WEBSITE TO MEAN SOMETHING<br/><br/>
                TO ENTERTAIN WITHOUT BEING UNDERSTOOD<br/><br/><br/><br/>
              <Zoom delay={2000}><div>WHAT IF WE CREATED OUR OWN META VERSE?</div></Zoom>
            </h1>
            </Zoom>
        </animated.div>
        </>}
        {step === 3 && <> 
        <animated.div style={animate}>
            <Zoom>
            <h1 style={{ fontSize:"3vw", position: 'absolute', top: '20vh', left: '10vw', width:"80vw", textAlign:"left"}}>
                BUILT WITH THE INTERPLANETARY FILESYSTEM
                <br/><br/>
                <Zoom delay={1000}><div>
                PROTECTED BY MILITARY GRADE ENCRYPTION
                <br/><br/>
                </div></Zoom>
                <Zoom delay={2500}><div>
                TECHNOLOGY USED TO GUARD NUCLEAR ARSENALS
                </div></Zoom>
                <br/><br/>
                <br/><br/>
                </h1>
            <h1 style={{fontSize:"4vw", position: 'absolute', top: '55vh', left: '70vw', width:"80vw" }}>
                <Zoom delay={4000}><div>NEVER DIE <Zoom delay={6000}><div>NEVER DIES.</div></Zoom></div></Zoom>
            </h1>
            </Zoom>
        </animated.div>
        </>}
        {step === 4 && <> 
        <animated.div style={animate}>
                <Zoom >
            <h1 style={{ fontSize:"3vw", 
                         position: 'absolute', 
                         top: '8vh', 
                         left: '20vw', 
                         width:"90vw" ,
                         textAlign:"left"}} >
                USE YOUR WORDS WISELY<br/><br/>
                <Zoom delay={500}><div>
                THEY WILL OUTLIVE YOU<br/><br/>
                </div></Zoom>
                <Zoom delay={1000}><div>
                THEY WILL NEVER BE ALTERED<br/><br/>
                </div></Zoom>
                <Zoom delay={1500}><div>
                AND NEVER BE ERASED.<br/><br/>
                </div></Zoom>
                <Zoom delay={2000}><div>
                ANONYOMOUSLY<br/><br/>
                </div></Zoom>
                <Zoom delay={2500}><div>
                CLEANSE YOUR SOUL.<br/><br/>
                </div></Zoom>
            </h1>
                </Zoom>
        </animated.div>
        </>}
          </Scroll>
        </ScrollControls>
        <Physics>
        {words.length !== 0 &&
            words.map((word, i)=>{
                if (word === " " ) {
                
                counted+=7
                    return}

                console.log(word.charCodeAt(0))
                if (between(word.charCodeAt(0),65,122)){
                const caps = word.charAt(0).toUpperCase()
                counted+=7
                return <TextMesh hAlign="right" position={[counted, height, -250]} children={caps}/>
                }
                return
            })
        }
        </Physics>
        <Preload/>
      </Suspense>
    }
export default function App(){ 
    return (
      <Canvas style={{height:"100vh", width:"100vw"}} >
        <RecoilRoot>
        <Suspense>
        <Embeded/>
        <CameraShake yawFrequency={0.03} rollFrequency={0.03} pitchFrequency={0.03} maxPitch={0.05} maxRoll={0.05} maxYaw={0.05}/ >
        <OrbitControls/>
        </Suspense>
        </RecoilRoot>

    </Canvas>
  );
}
