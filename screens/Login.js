import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
// formik
import { Formik } from 'formik';
// styles
import {
  StyledContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledInputLabel,
  StyledFormArea,
  StyledButton,
  StyledTextInput,
  LeftIcon,
  RightIcon,
  InnerContainer,
  ButtonText,
  MsgBox,
  Colors,
} from './../components/styles';
import { View, ActivityIndicator, ImageBackground } from 'react-native';
//colors
const { primary, mustard, purple, babypink, panna, shadow} = Colors;
// icon
import { Octicons, Ionicons } from '@expo/vector-icons';
// keyboard avoiding view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';
// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';
// credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  // credentials context
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

  //login button is clicked: check if credentials are correct
  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const usernameCorrect = 'find.stranger';
    const passwordCorrect = 'findStr@nger';
    try{
      if (credentials.username == usernameCorrect && credentials.password == passwordCorrect) {
        persistLogin(credentials);
         } else {
        handleMessage('Your credentials are incorrect.'); //Message to user on incorrect credentials error
         }
        setSubmitting(false);
    }
    catch(error){
      setSubmitting(false);
      handleMessage('An error occurred. Check your credentials or network and try again'); //Message to user on error cases
    }
  };

  const handleMessage = (message, type = '') => {
    setMessage(message);
    setMessageType(type);
  };

  // Persisting login: After credentials check ↑
  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem('KSCredentials', JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials); //store credentials
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <ImageBackground source={require('../assets/img/bg1.png')} resizeMode='cover' style={{width: '100%', height: '100%', zIndex: 0}}>
      <KeyboardAvoidingWrapper>       
       <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>        
              {/* <PageLogo source={require('../assets/ks-logo-01.png')} /> */}
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.username == '' || values.password == '') {
                handleMessage('Please fill in all fields');
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
            
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Username"
                  placeholderTextColor={primary}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                />
                <MyTextInput
                  label="Password"
                  placeholderTextColor={primary}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>

                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>       
    </KeyboardAvoidingWrapper>

</ImageBackground>
 );

                
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={20} color={purple} />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
