import { StatusBar, Text, View } from "react-native"
import { CalculatorScreen } from './presentation/screens/CalculatorScreen';
import { styles } from "./config/theme/app-theme";

export const App = () => {
  return (
    <View style={styles.background}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'black'}
      />
      <CalculatorScreen/>
    </View>
  )
}
