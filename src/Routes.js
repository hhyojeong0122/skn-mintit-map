import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AtmMapPage from "./pages/AtmMapPage";
import AtmMapDetailPage from "./pages/AtmMapDetailPage";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={AtmMapPage} />
        <Route exact path="/detail" component={AtmMapDetailPage} />
      </Switch>
    </Router>
  );
}