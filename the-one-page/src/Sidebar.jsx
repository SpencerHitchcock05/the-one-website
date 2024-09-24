import { useState } from "react";
import SidebarParagraph from "./SidebarParagraph";
import cross from "./img/white_cross.png";
import chevron from "./img/white_chevron.png";

export default function Sidebar(props) {
    const data = props.data;
    const [hidden, setHidden] = useState(false);
    
    function handleClick() {
        setHidden(!hidden);
        console.log(hidden)
    }
    

    return (
        <>
            <img className="sidebar-close" onClick={handleClick} src={hidden? chevron : cross}></img>
            <div className="sidebar-background" style={{animationName: hidden? "sidebar-panel-2" : "sidebar-panel-1"}}>
                
                <div className="sidebar-container">
                    <SidebarParagraph data={data}/>
                </div>
                
            </div>
        </>
    )
}