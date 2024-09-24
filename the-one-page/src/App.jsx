import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import './App.css'
import UserMap from './UserMap.jsx'
import Sidebar from './Sidebar.jsx';
import characters from './data/lotrCharacterData.json'

const lowerCaseWords = ['of'];

const format = (str) => {
  const normStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let wordsSplit = normStr.split(" ");
  // if there is uneeded spaces in the query it will error because words has empty values [ipsum, "", ]
  const words = wordsSplit.filter(word => word != "")
  for (let i = 0; i < words.length; i++) {
    console.log(words[i])
    let splitStr = words[i].split("");
    if (!lowerCaseWords.includes(words[i])) {
      splitStr[0] = splitStr[0].toUpperCase();
    }
    words[i] = splitStr.join("")
  }
  return words.join(" ")
}

const checkCharacters = (str) => {
  if (!str) return false;
  const characterList = Object.keys(characters);
  const name = format(str).split(" ")[0];
  for (let i = 0; i < characterList.length; i++) {
    let tempName = characterList[i].split(' ')[0];
    if (tempName == name && tempName != 'The') {
      return characterList[i];
    }
  }
  return format(str);
}

function App() {
  const [query, setQuery] = useState("")
  const param = new URLSearchParams(window.location.search)
  const searchbar = useRef();
  const coord = useRef([0,0])
  useEffect(() => {
      const character = param.get('query')? checkCharacters(param.get('query')) : ""
      if (character) {
        setQuery(character);
      }
      
      let coords = param.get('coord')? param.get('coord').split(",") : ["0", "0"]

      for (let i = 0; i < coords.length; i++) {
        coords[i] = parseInt(coords[i]);
      }

      coord.current = coords;

      searchbar.current.value = param.get('query');
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    
    if (characters.hasOwnProperty(e.target.value)) {
      console.log('yes')
    }
    
  }

  return (
    <div className='app-container'>
      <UserMap coord={coord.current} query={query}/>
      <div className='navbar'>
        <div className='navbar-logo'>The One Website</div>
        <form action="./">
          <input ref={searchbar} className="searchbar" type="text" name="query" onChange={handleSearch} />
        </form>  
      </div>
      {!checkCharacters(query) && <div style={{flex:0.5}}></div>} 
      {(checkCharacters(query)) && <Sidebar data={query}/>}
      
    </div>
  )
}

export default App
