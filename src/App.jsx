import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminPanel from "../pages/adminpanel";
import StudentPanel from "../pages/StudentPanel";
import Vocabulary from "./forms/vocabulary";
import Sentence from "./forms/Sentence";
import Practice from "./forms/Practice";
import Avatars from "../pages/Avatars";
import StudentToAvatar from "./forms/StudentToAvatar";
import AvatarToStudent from "./forms/AvatarToStudent";
import Quiz from "./forms/Quiz";


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<AdminPanel />} />  {/* Landing Page */}
        <Route path="adminpanel" element={<AdminPanel />} />
        <Route path="studentpanel" element={<StudentPanel />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="practice" element={<Practice />} />
        <Route path="sentence" element={<Sentence />} />
                <Route path="avatars" element={<Avatars />} />
         <Route path="studenttoavatar" element={<StudentToAvatar/>}/>
                  <Route path="avatartostudent" element={<AvatarToStudent/>}/>
                  <Route path="quiz" element ={<Quiz/>}/>

      </Route>
    </Routes>
  );
}

export default App;
