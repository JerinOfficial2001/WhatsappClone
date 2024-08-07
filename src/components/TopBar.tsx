import React, {useContext} from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {DarkThemeSchema, JersAppThemeSchema} from '../../utils/theme';
import {MyContext} from '../../App';
import MenuComponent from './MenuComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import {MyContext, MyContextType} from '../../App';

interface TopBarProps {
  title: string;
  rightOnPress: () => void;
  isDelete?: boolean;
  lefOnPress?: () => void;
  arrow?: boolean;
  subtitle?: string;
  isTyping?: boolean;
  MenuComponent?: React.ReactNode;
  showVideo?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  rightOnPress,
  isDelete,
  lefOnPress,
  arrow,
  subtitle,
  isTyping,
  MenuComponent,
  showVideo,
}) => {
  const {jersAppTheme, setpageName} = useContext<any>(MyContext);

  return (
    <View style={[styles.container, {backgroundColor: jersAppTheme.appBar}]}>
      <View style={styles.leftContainer}>
        {arrow && (
          <TouchableOpacity onPress={lefOnPress}>
            <Image
              source={require('../assets/leftArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>
              {isTyping ? 'typing...' : 'Online'}
            </Text>
          )}
        </View>
      </View>
      {showVideo && (
        <TouchableOpacity onPress={rightOnPress}>
          {/* {isDelete ? (
          <Image source={require('../assets/delete.png')} style={styles.icon} />
        ) : (
          !arrow && (
            <Image
              source={require('../assets/vertIcon.png')}
              style={styles.icon}
            />
          )
        )} */}
          <Ionicons name="videocam" size={26} color={jersAppTheme.themeText} />
        </TouchableOpacity>
      )}
      {MenuComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  leftContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  arrowIcon: {
    height: 25,
    width: 25,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    color: 'white',
    letterSpacing: 1,
    fontSize: 10,
  },
  icon: {
    height: 25,
    width: 25,
  },
});

export default TopBar;
