import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AtmMapPage from "./pages/AtmMapPage";
import AtmMapDetailPage from "./pages/AtmMapDetailPage";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/skn-mintit-map/" component={AtmMapPage} />
        <Route
          exact
          path="/skn-mintit-map/detail"
          component={AtmMapDetailPage}
        />
      </Switch>
    </Router>
  );
}
