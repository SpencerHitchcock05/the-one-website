import { useEffect, useRef, useState } from 'react'
import middleEarthMap from './img/unlabeled-map.jpg' 
import landmarkData from './data/landmarkData.json'
import Landmark from './Landmark';

function calculateMinMax(tempX, tempY, mapWidth, mapHeight, scale) {
    let minX = mapWidth * (Math.pow(scale, 1.2)) / -2;
    let maxX = window.innerWidth - (mapWidth * Math.pow(scale, 0.8) / 2);
    let minY = mapHeight * Math.pow(scale, 1.3) / -2;
    let maxY = window.innerHeight - (mapHeight * Math.pow(scale, 0.5) / 2);
    return [Math.min(maxX, Math.max(tempX, minX)), Math.min(maxY, Math.max(tempY, minY))];
}

export default function UserMap(props) {
    const ref = useRef();
    const [clicking, setClicking] = useState(false);
    const [tempCoord, setTempCoord] = useState([0, 0]);
    const [currCoord, setCurrCoord] = useState([0,0]);
    const [scale, setScale] = useState(1);

    const minScale = 0.6;
    const maxScale = 4;
    const mapWidth = 1200;
    const mapHeight = mapWidth / (3525 / 2475);
    

    

    

    useEffect(() => {
        
        if (props.coord[0] != 0 && props.coord[1] != 0) {
            setScale(2);
            setCurrCoord([props.coord[0], props.coord[1]]);
        } 
        
        
        //setCurrCoord([props.coord[0], props.coord[1]]);
        /*
        console.log(landmarkData.hasOwnProperty(props.query));
        if (landmarkData.hasOwnProperty(props.query) && props.query) {
            setScale(2);
            console.log((landmarkData[props.query].x * -2) + (window.innerWidth / 3), (landmarkData[props.query].y * -2) + window.innerHeight / 2 )
            setCurrCoord((landmarkData[props.query].x * -2) + (window.innerWidth / 3), (landmarkData[props.query].y * -2) + window.innerHeight / 2 )
            
        }
        */

        //ref.current.style.transform = `translate(${props.coord[0]}px, ${props.coord[1]}px) scale(${2})`;
        
        
        
    }, [props])

    useEffect(() => {
        ref.current.style.transform = `translate(${currCoord[0]}px, ${currCoord[1]}px) scale(${scale})`;
    }, [currCoord])

    function handleMouseDown(e) {
        setClicking(true);
        setTempCoord(prev => {return [e.clientX, e.clientY]})
        /*
        for (let i = 0; i < 2; i++) {
            handleWheel({clientX: window.innerWidth / 3, clientY: window.innerHeight / 2, deltaY: -125})
        }
        */
    }

    function handleMouseMove(e) {
        //console.log(e.clientX);
        if (clicking) {
            let tempX = currCoord[0] + e.clientX - tempCoord[0];
            let tempY = currCoord[1] + e.clientY - tempCoord[1];
            let newCoords = calculateMinMax(tempX, tempY, mapWidth, mapHeight, scale);
            ref.current.style.transform = `translate(${newCoords[0]}px, ${newCoords[1]}px) scale(${scale})`;
        }
    }

    function handleMouseUp(e) {
        setClicking(false)
        setCurrCoord(prev => {
            let tempX = prev[0] + e.clientX - tempCoord[0];
            let tempY = prev[1] + e.clientY - tempCoord[1];
            let newCoords = calculateMinMax(tempX, tempY, mapWidth, mapHeight, scale)
            return [newCoords[0], newCoords[1]]
        });
    }

    function handleWheel(e) {
        let style = ref.current.style;
        
        console.log(e.deltaY);

        if ((scale > minScale) && (scale < maxScale)) {
            setCurrCoord(prev => {
                let tempX = prev[0] - (((mapWidth * (scale + e.deltaY * -0.001)) - mapWidth * scale) / ((mapWidth * scale) / (e.clientX - prev[0]))) // (mapWidth / (mouse.x - prev[0])) );
                let tempY = prev[1] - (((mapHeight * (scale + e.deltaY * -0.001)) - mapHeight * scale) / ((mapHeight * scale) / (e.clientY - prev[1])));
                let newCoords = calculateMinMax(tempX, tempY, mapWidth, mapHeight, scale)
                return [newCoords[0], newCoords[1]]
            })
        }   

        setScale(prev => {return Math.min(Math.max(prev + e.deltaY * -0.001, minScale), maxScale)})

        style.transform = `translate(${currCoord[0]}px, ${currCoord[1]}px) scale(${scale})`
        console.log(scale)
    }

    return (
        <div ref={ref} id="map" onPointerLeave={() => {if (clicking) { setClicking(false); return handleMouseUp}}} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onWheel={handleWheel}>
            <img referrerPolicy='no-referrer' crossOrigin='anonymous' className='map-image' src={middleEarthMap} draggable="false"></img>
            {Object.keys(landmarkData).map(data => {
                return (
                    <Landmark key={data} x={landmarkData[data].x} y={landmarkData[data].y} name={data} coord={currCoord} scale={scale}/>
                )
            })}
        </div>
            
       
    )
}