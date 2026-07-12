import { Route, Routes } from "react-router-dom";
import AthleteDashboard from "./AthleteDashboard";
import AthleteResults from "./AthleteResult";
import ChampionshipsPage from "./ChampionshipsPage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


export default function AthletePage(){

    const navigate = useNavigate();
    const [userLoaded, setUserLoaded] = useState(false)
    
      useEffect(
        ()=>{
          const token = localStorage.getItem("token");
    
          if(token == null){
    
            toast.error("Please login to access athlete panel");
            navigate("/login");
            return;
          }
    
    
          axios.get(import.meta.env.VITE_API_URL + "/api/users/me",{
              headers : {
                  Authorization: `Bearer ${token}`,
              },
          }).then((res)=>{
              if(res.data.user.role !== "athlete"){
                toast.error("You are not authorized to access athlete panel");
                navigate("/");
                return;
              }
    
              setUserLoaded(true);
    
          }).catch(()=>{
              toast.error("Session expired. Please login again");
              localStorage.removeItem("token");
              navigate("/login");
          })
          
        },[]
      )

    if (!userLoaded) return null

    return (

        
        <Routes path="/athlete">
            
            <Route path="/dashboard" element={<AthleteDashboard />} />
            <Route path="/results" element={<AthleteResults />} />
            <Route path="/championships" element={<ChampionshipsPage />} />
            <Route path="*" element={<AthleteDashboard />} />
            
        </Routes>
    );
}