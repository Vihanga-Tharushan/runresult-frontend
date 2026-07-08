import { Route, Routes } from "react-router-dom";
import AthleteDashboard from "./AthleteDashboard";
import AthleteResults from "./AthleteResult";
import ChampionshipsPage from "./ChampionshipsPage";


export default function AthletePage(){

    return (

        
        <Routes path="/athlete">
            
            <Route path="/dashboard" element={<AthleteDashboard />} />
            <Route path="/results" element={<AthleteResults />} />
            <Route path="/championships" element={<ChampionshipsPage />} />
            <Route path="*" element={<AthleteDashboard />} />
            
        </Routes>
    );
}