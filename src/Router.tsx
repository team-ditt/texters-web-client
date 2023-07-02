import {Navigate, Route, Routes} from "react-router-dom";

import {HomePage} from "@/page";

export default function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
