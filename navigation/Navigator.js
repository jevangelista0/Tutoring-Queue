import Login from '../screens/login'
import Welcome from '../screens/welcome'
import SignUp from '../screens/signup'
import Home from '../screens/home'
import Loading from '../screens/loading'
import Verify from '../screens/verify'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

const AppStack = createStackNavigator( // in app screen
  {
    Home: {
      screen: Home
    },
  },
  {
    headerMode: 'none'
  }
)

const AuthStack = createStackNavigator( // out of app screens
  {
    Login: {
      screen: Login
    },
    Welcome: {
      screen: Welcome
    },
    SignUp: {
      screen: SignUp
    },
  },
  {
    headerMode: 'none'
  }
)

export default createAppContainer(
  createSwitchNavigator( // navigate between stacks
    {
      Loading,
      Verify,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'Loading'
    }
  )
)