import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Pressable,
    Alert,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { Link, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        console.log('FormData:', formData);

        try {
            const response = await fetch('http://192.168.8.101:8000/user/token', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                await AsyncStorage.setItem('access_token', data.access_token);
                await AsyncStorage.setItem('refresh_token', data.refresh_token);

                const decodedToken = jwtDecode(data.access_token);
                console.log('Decoded Token:', decodedToken);

                // @ts-ignore
                const username = decodedToken.sub;
                // @ts-ignore
                const userType = decodedToken.type;
                // @ts-ignore
                const approved = decodedToken.approved;

                await AsyncStorage.setItem('username', username as string);
                await AsyncStorage.setItem('userType', userType);
                await AsyncStorage.setItem('approved', String(approved));

                if (userType === 'ADMIN') {
                    router.push('/admin');
                } else if (approved) {
                    router.push('/user');
                } else {
                    router.push('/waiting');
                }

            } else {
                Alert.alert('Error', data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        } finally {
            setLoading(false); // Hide loader and enable button
        }
    };

    return (
        <ImageBackground
            source={require('./../../assets/images/background.jpeg')} // Replace with your image URL or require('./path/to/image.jpg')
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
            <Text style={styles.headerText}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="white"
                    value={username}
                    onChangeText={setUsername}
                    editable={!loading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="white"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                />

                <Text style={styles.signupText}>
                    Not registered?
                    <Link href={'/register'}>
                        <Text style={styles.signupLink}> Sign Up here</Text>
                    </Link>
                </Text>

                <Pressable onPress={handleLogin} disabled={loading}>
                    <View style={[styles.loginButton, loading && styles.disabledButton]}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </View>
                </Pressable>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: '#6b7de4',
        
        borderRadius: 10,
        backgroundColor: ' rgba(100, 100, 100, 0.5)', 
        alignSelf: 'center', 
    },
    title: {
        fontFamily: 'roboto-medium',
        color: '#0b0440',
        fontSize: 36,
        letterSpacing: 1,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    input: {
      width: '80%',
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
      color: '#fff',
      fontFamily: 'roboto'
  },
    signupText: {
        color: '#FFFFFF',
        fontFamily: 'roboto',
        marginBottom: 20,
        marginTop: 10,
        textAlign: 'right',
        width: '80%',
    },
    signupLink: {
        color: '#27c3ce',
        fontFamily: 'roboto',
        fontWeight: 'bold',
    },
    loginButton: {
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 10,
        backgroundColor: '#6b7de4',
        textAlign: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontFamily: 'roboto-medium',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#8a8a8a',
    },
    headerText: {
        fontSize: 30,
        color: '#fff',
        marginBottom: 20,
        fontFamily: 'roboto-bold'
    },
});

export default LoginScreen;
