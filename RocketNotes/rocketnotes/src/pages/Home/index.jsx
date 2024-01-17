import { useState, useEffect } from "react";

import { FiPlus, FiSearch } from "react-icons/fi";
import { Container, Brand, Menu, Search, Content, NewNote } from "./styles";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { ButtonText } from "../../components/ButtonText";
import { Section } from "../../components/Section";
import { Note } from "../../components/Note";
import { api } from "../../../../../Api/src/services/api";


export function Home() {
  const [tags, setTags] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState([]);

  function handleTagsSelected(tagName){
    const alreadySelected = tagsSelected.includes(tagName);
    if(alreadySelected){
      const filteredTags = tagsSelected.filter(tag => tag !== tagName);
      setTagsSelected(filteredTags)
    } else {
      setTagsSelected(prevState => [...prevState, tagName]);
    }
  }

  useEffect(() => {
    async function fetchTags(){
      const response = await api.get("/tags")
      setTags(response.data);
    }

    fetchTags();

  },[]);

  useEffect(() => {
    async function fetchNotes(){
      const response = await api.get(`/notes?title=${search}&tags=${tagsSelected}`);
      setNotes(response.data);
    }

    fetchNotes();
  },[tagsSelected, search])

  return (
    <Container>
      <Brand>
        <h1>Rocketnotes</h1>
      </Brand>
      <Header></Header>
      <Menu>
        <li><ButtonText 
        title="All" 
        $isactive={tagsSelected.length === 0}
        onClick={() => handleTagsSelected("all")}
        /></li>
      {
        tags && tags.map(tag => (
        <li key={String(tag.id)}>
        <ButtonText
        title={tag.name}
        onClick={() => handleTagsSelected(tag.name)}
        $isactive={tagsSelected.includes(tag.name)}
        />
        </li>
        ))
        }
      </Menu>
      <Search>
        <Input 
        placeholder="Search by title" 
        icon={FiSearch}
        onChange={(e) => setSearch(e.target.value)}
        />
      </Search>
      <Content>
        <Section title="My grades">
          {
            notes.map(note => (
            <Note 
            key={String(notes.id)}
            data={note}
            />
            ))
          }
                
        </Section>
      </Content>
      <NewNote to="/new">
        <FiPlus />
        Create note
      </NewNote>
    </Container>
  );
}
