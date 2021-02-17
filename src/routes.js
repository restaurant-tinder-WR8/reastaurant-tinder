import { Switch, Route } from 'react-router-dom';
import Auth from './components/Auth/Auth'
import Dash from './components/Dash/Dash'

export default (
    <Switch>
        <Route exact path="/" component={Auth} />
        <Route path="/dash" component={Dash} />
    </Switch>
)