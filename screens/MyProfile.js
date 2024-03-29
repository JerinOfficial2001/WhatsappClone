import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Avatar, Button, IconButton, TextInput} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import ProfilePicModel from '../src/components/ProfilePicModel';
import {useFocusEffect} from '@react-navigation/native';
import {GetUsersByID, UpdateProfile} from '../src/controllers/auth';
export default function MyProfile({route, ...props}) {
  const {id, image} = route.params;

  const [openImageModel, setopenImageModel] = useState(false);
  const [formData, setformData] = useState({
    mobNum: '',
    password: '',
    name: '',
    image: null,
  });
  const [err, seterr] = useState(false);
  const [errMsg, seterrMsg] = useState('');
  const handleFormData = (key, value) => {
    setformData(prev => ({...prev, [key]: value}));
  };
  const handlePick = async () => {
    const result = await DocumentPicker.pick({
      mode: 'open',
      presentationStyle: 'fullScreen',
      type: [DocumentPicker.types.images],
    });
    handleFormData('image', result[0]);
    if (result) {
      handleCloseModel();
    }
  };
  const convertToMultipart = new FormData();

  const handleSubmit = () => {
    if (
      !err &&
      formData.mobNum !== '' &&
      formData.password !== '' &&
      formData.name !== ''
    ) {
      Object.entries(formData).forEach(([key, value]) =>
        convertToMultipart.append(key, value),
      );
      const DATA = {
        id,
        formData: convertToMultipart,
      };
      UpdateProfile(DATA);
    } else {
      handleValidation('name', formData.name);
    }
  };
  const handleValidation = (name, value) => {
    if (name == 'name') {
      if (!value) {
        seterr(true);
        seterrMsg('Name is required');
      } else {
        if (value.length > 0) {
          seterr(false);
        } else {
          seterr(true);
          seterrMsg('Name is required');
        }
      }
    }
  };
  const handleOnchange = (name, value) => {
    handleValidation(name, value);
    handleFormDatas(name, value);
  };
  const handleFormDatas = (name, value) => {
    setformData(prev => ({...prev, [name]: value}));
  };
  // useFocusEffect(
  //   React.useCallback(() => {

  //   }, []),
  // );

  useEffect(() => {
    GetUsersByID(id).then(data => {
      if (!image) {
        setformData({
          mobNum: data.mobNum,
          password: data.password,
          name: data.name,
          image: data.image,
        });
      } else {
        setformData({
          mobNum: data.mobNum,
          password: data.password,
          name: data.name,
          image:
            image && image.uri
              ? {
                  url: image.uri,
                  type: 'image/jpeg',
                  name: 'image.jpg',
                }
              : image?.type
              ? {
                  ...image,
                }
              : null,
        });
      }
    });
  }, [image]);
  const handleCloseModel = () => {
    setopenImageModel(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Add Personal Details</Text>
        <View style={{position: 'relative'}}>
          {formData.image && formData.image.url ? (
            <Avatar.Image size={200} source={{uri: formData.image.url}} />
          ) : (
            <Avatar.Image
              size={200}
              source={
                formData.image != null
                  ? formData.image
                  : require('../src/assets/user.png')
              }
            />
          )}
          <IconButton
            style={{
              bottom: 0,
              position: 'absolute',
              right: 5,
              backgroundColor: '#008069',
              padding: 10,
            }}
            icon={() => (
              <Image
                style={{
                  height: 25,
                  width: 25,
                }}
                source={require('../src/assets/camera.png')}
              />
            )}
            size={40}
            onPress={() => {
              setopenImageModel(true);
            }}
          />
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          <TextInput
            value={formData.name}
            onChangeText={value => {
              handleOnchange('name', value);
            }}
            style={styles.input}
            underlineColor="gray"
            activeUnderlineColor="#92d4c7"
            placeholder="Name"
            keyboardType="default"
            textColor="black"
            error={err}
          />
          {err && <Text style={styles.errorText}>{errMsg}</Text>}
        </View>
      </View>
      <Button
        onPress={handleSubmit}
        mode="contained"
        style={styles.button}
        textColor="white">
        Submit
      </Button>
      <ProfilePicModel
        handleDltProfilePic={() => {
          handleFormData('image', null);
          handleCloseModel();
        }}
        visible={openImageModel}
        setVisible={setopenImageModel}
        handlePick={handlePick}
        handleCamera={() => {
          handleCloseModel();
          props.navigation.navigate('AddStatus', {
            onlyCamera: true,
            id,
          });
        }}
      />
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
    gap: 90,
  },
  title: {
    fontSize: 20,
    color: '#008069',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
    width: '90%',
  },
  button: {
    backgroundColor: '#008069',
  },
});
