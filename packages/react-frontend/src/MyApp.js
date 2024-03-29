import React, { useState, useEffect } from "react";
import Table from "./Table"
import Form from "./Form";


function MyApp() {
    const [characters, setCharacters] = useState([]);

    
    function fetchUsers() {
      const promise = fetch("http://localhost:8000/users");
      return promise;
    }

    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json))
        .catch((error) => { console.log(error); });
    }, [] );
    
    function removeOneCharacter(index) {
      const id = characters[index]["_id"];
      fetch(`http://localhost:8000/users/${id}`, {
        method: 'DELETE'
      }).then(response => {
        // If unsuccessful, return nothing
        if (response.status !== 204) { 
          return;
        // Else, return updated  
        } else {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        }
      })
    }

    function postUser(person) {
      const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
  
      return promise;
    }

    function updateList(person) { 
      postUser(person).then(data => data.json())
        .then(newData => setCharacters([...characters, newData]))
        .catch((error) => {
          console.log(error);
        })
    }


  return (
    <div className="container">
      <Table 
        characterData={characters}
        removeCharacter={removeOneCharacter}    
        />
    <Form handleSubmit={updateList}/>
    </div>
  );
}
export default MyApp;
