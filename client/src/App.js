import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Ballot, SharedLayout, Error } from "./pages";
import { useIsMounted } from "./hooks";

function App() {
  const isMounted = useIsMounted();
  if (!isMounted) return <></>;
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Ballot />} />
            <Route exact path="/ballot" element={<Ballot />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
