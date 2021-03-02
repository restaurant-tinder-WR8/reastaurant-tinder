import { Switch, Route } from 'react-router-dom';
import Auth from './components/Auth/Auth'
import Dash from './components/Dash/Dash'
import Profile from './components/Profile/Profile'


export default (
    <Switch>
        <Route exact path="/" component={Auth} />
        <Route path="/dash" component={Dash} />
        <Route path="/profile" component={Profile} />
    </Switch>
)