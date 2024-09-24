import {useEffect, useRef} from 'react';


export default function Landmark(props) {
    const ref = useRef();
    const x = props.x;
    const y = props.y;
    useEffect(() => {
        ref.current.style.left = x + 'px';
        ref.current.style.top = y + 'px';
    }, [])
    return (
        <div ref={ref}  className="landmark">
            <a href={`/?query=${props.name}&coord=${[(x * -2) + (window.innerWidth / 3), (y * -2) + window.innerHeight / 2 ]}`}>{props.name}</a>
        </div>
    )
}