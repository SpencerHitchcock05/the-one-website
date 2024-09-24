import {useState, useEffect} from 'react';
import axios from 'axios';
import EyeLogo from './EyeLogo.jsx'

export default function sidebarParagraph(props) {
    const [characterInfo, setCharacterInfo] = useState({text: [], err: false})
    const data = props.data;
    
    useEffect(() => {
        axios(`http://127.0.0.1:8000/:${data}`) 
        .then(res => {
            
            setCharacterInfo(prev => {
                return {...prev, ...res.data}
            })
        }).catch(err => {
            console.log(err);
        })
        
        axios(`http://127.0.0.1:8000/:${data}/img`) 
        .then(res => {
            
            setCharacterInfo(prev => {
                return {...prev, ...res.data}
            })
        }).catch(err => {
            console.log(err);
        })
        
    }, [])
   
        
    
    return (
        <div className="sidebar-paragraph">
            <h1>{data}</h1>
            <img className="sidebar-image" src={characterInfo.img}/>
            {characterInfo.text.map(text => {
                return (
                    <p key={text}>{text}</p>
                )
            })}
            {!characterInfo.text[0] && <EyeLogo />}
            {characterInfo.err && 
                <>
                    <p style={{}}>
                        oops! It doesn't look like your search query "{data}" is compatible with our resources.
                    </p>  
                    <p>
                    Try using a different or an
                        alternative name for your query, or try checking your internet connection.
                    </p>
                </>
            }
            {characterInfo.text[0] && <a target="_blank" href={`https://lotr.fandom.com/wiki/${data}`}>Fandom.lotr</a>}
        </div>
    )
}