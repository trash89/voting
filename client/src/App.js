import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VotingContainer, SharedLayout, Error } from "./pages";
import { useIsMounted } from "./hooks";

function App() {
  const isMounted = useIsMounted();
  if (!isMounted) return <></>;
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<VotingContainer />} />
            <Route exact path="/voting" element={<VotingContainer />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
