import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  MD2Colors,
  TextInput,
} from 'react-native-paper';
import {login} from '../../src/controllers/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

export default function Login(props) {
  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, []),
  );

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userData');
    // If a token exists, navigate to the home screen
    const userData = token ? JSON.parse(token) : false;
    if (userData) {
      // Navigate to the 'Home' screen
      props.navigation.navigate('Home', {
        userID: userData._id,
      });
    }
  };
  const [formData, setformData] = useState({mobNum: '', password: ''});
  const [isHide, setisHide] = useState(false);
  const [errMsg, seterrMsg] = useState({});
  const [mobNubErr, setmobNubErr] = useState(false);
  const [passwordErr, setpasswordErr] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const handleSubmit = () => {
    if (
      !mobNubErr &&
      !passwordErr &&
      formData.mobNum !== '' &&
      formData.password !== ''
    ) {
      setisLoading(true);
      AsyncStorage.removeItem('token');
      login(formData.mobNum, formData.password, props);
      setisLoading(false);
    }
  };
  const handleValidation = (name, value) => {
    if (name == 'mobNum') {
      if (!value) {
        setmobNubErr(true);
        seterrMsg({...errMsg, mobNum: 'Phone Number is required'});
      } else {
        if (value.length == 10) {
          setmobNubErr(false);
        } else {
          setmobNubErr(true);
          seterrMsg({...errMsg, mobNum: 'Phone Number must have 10 integers'});
        }
      }
    } else if (name == 'password') {
      if (!value) {
        setpasswordErr(true);
        seterrMsg({...errMsg, password: 'Password is required'});
      } else {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (passwordRegex.test(value)) {
          setpasswordErr(false);
        } else {
          setpasswordErr(true);
          seterrMsg({
            ...errMsg,
            password: 'Please enter a valid password',
          });
        }
      }
    }
  };
  const handleOnchange = (name, value) => {
    handleValidation(name, value);
    setformData({...formData, [name]: value});
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Enter your phone number</Text>
        <TextInput
          value={formData.mobNum}
          onChangeText={value => {
            handleOnchange('mobNum', value);
          }}
          style={styles.input}
          underlineColor="gray"
          activeUnderlineColor="#92d4c7"
          placeholder="Phone number"
          keyboardType="numeric"
          textColor="black"
          error={mobNubErr}
        />
        {mobNubErr && <Text style={styles.errorText}>{errMsg.mobNum}</Text>}
        <TextInput
          error={passwordErr}
          secureTextEntry={isHide ? true : false}
          value={formData.password}
          onChangeText={value => {
            handleOnchange('password', value);
          }}
          style={styles.input}
          underlineColor="gray"
          activeUnderlineColor="#92d4c7"
          placeholder="Password"
          textColor="black"
          right={
            <TextInput.Icon
              icon={() => (
                <TouchableOpacity
                  onPress={() => {
                    setisHide(!isHide);
                  }}>
                  {isHide ? (
                    <Image
                      source={require('../../src/assets/view.png')}
                      style={{height: 25, width: 25}}
                    />
                  ) : (
                    <Image
                      source={require('../../src/assets/hide.png')}
                      style={{height: 25, width: 25}}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          }
        />
        {passwordErr && <Text style={styles.errorText}>{errMsg.password}</Text>}
      </View>
      <Button
        disabled={isLoading}
        onPress={handleSubmit}
        mode="contained"
        style={styles.button}
        textColor="white">
        {isLoading ? (
          <ActivityIndicator animating={true} color={MD2Colors.greenA100} />
        ) : (
          'Next'
        )}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20, // Add marginBottom to create space between inputs and button
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 20,
    color: '#008069',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
    width: '90%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#008069',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
});
