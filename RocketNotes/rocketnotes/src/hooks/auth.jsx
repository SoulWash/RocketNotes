import { createContext, useContext, useState, useEffect } from "react";
import {api} from "../../../../Api/src/services/api"

export const AuthContext = createContext({})

function AuthProvider({children}){
    const [data, setData] = useState({})

    async function signIn({email, password}){
        try{
        const response = await api.post("/sessions", {email, password});
        const {user, token} = response.data;

        localStorage.setItem("@rocketnotes:user", JSON.stringify(user));
        localStorage.setItem("@rocketnotes:token", token);


        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setData({user, token});

        } catch(error){
            if(error.response){
                alert(error.response.data.message)
            } else {
                alert("Unable to enter.")
            }
        }
    }

    function signOut(){
        localStorage.removeItem("@rocketnotes:token");
        localStorage.removeItem("@rocketnotes:user");

        setData({});
    }

    async function updateProfile({user, avatarFile}){
        try {

            if(avatarFile){
                const fileUploadForm = new FormData();
                fileUploadForm.append("avatar", avatarFile);

                const response = await api.patch("/users/avatar", fileUploadForm);
                user.avatar = response.data.avatar;
            }

            await api.put("/users", user);
            localStorage.setItem("@rocketnotes:user", JSON.stringify(user));

            setData({user, token: data.token})
            alert("Updated profile")

        } catch(error){
            if(error.response){
                alert(error.response.data.message)
            } else {
                alert("Unable to update profile.")
            }
        }
    }


    useEffect(()=>{
        const token = localStorage.getItem("@rocketnotes:token");
        const user = localStorage.getItem("@rocketnotes:user");

        if(token && user){
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setData({
                token,
                user: JSON.parse(user)
            })
        }

    }, [])


    async function sendNewNote(title, description, tags, links){
        
        try{            
            await api.post("/notes", {
                title,
                description,
                tags,
                links
            })
            alert("Nota criada com sucesso")
            

        } catch(error) {
            if(error.response){
                alert(error.response.data.message)
            } else {
                alert("Nota não cadastrada")
            }
        }
    }


    return (
    <AuthContext.Provider value={{signIn, signOut, updateProfile, sendNewNote, user: data.user}}>
        {children}
    </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext);

    return context
}

export {
    AuthProvider,
    useAuth
}