import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Link, router } from "expo-router";
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icons

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const showInstructionPopup = () => {
        setModalVisible(true);
    };

    const handleImagePick = async () => {
        if (images.length >= 5) {
            Alert.alert('Already captured 5 images');
            return;
        }

        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission to access camera is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // @ts-ignore
            setImages(prevImages => {
                if (prevImages.length < 5) {
                    return [...prevImages, result.assets[0].uri];
                }
                return prevImages;
            });
        } else {
            Alert.alert('Image capture was canceled');
        }
    };

    const handleRegister = async () => {
        if (!name || !username || !password || images.length !== 5) {
            Alert.alert('Error', 'Please fill all fields and upload exactly 5 images');
            return;
        }

        setLoading(true); // Show loader and disable button

        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('password', password);

        images.forEach((image, index) => {
            // @ts-ignore
            formData.append('images', {
                uri: image,
                type: 'image/jpeg',
                name: `image${index + 1}.jpg`,
            });
        });

        try {
            const response = await fetch('http://lahiru174.ddns.net:8000/users/register', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Registration successful');
                setName('');
                setUsername('');
                setPassword('');
                setImages([]);
                router.push('/login');
            } else {
                Alert.alert('Error', data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        } finally {
            setLoading(false); // Hide loader and enable button
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Instruction</Text>
                        <Text style={styles.modalText}>For the best identification accuracy, please upload images with different poses.</Text>
                        <Image
                            style={styles.modalImage}
                            source={require('./../../assets/images/poses.gif')}
                        />
                        <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Image
                style={styles.backgroundImage}
                source={require('./../../assets/images/background.jpeg')}
            />

            <View style={styles.overlay}>
                <Text style={styles.headerText}>Register</Text>
                <View style={styles.iconContainer}>
                    <Pressable onPress={handleImagePick} disabled={loading} style={styles.faceIconButton}>
                    <Icon name="user-circle" size={80} color="#fff" />
                     <Pressable onPress={handleImagePick} disabled={loading} style={styles.cameraIconButton}>
                    <Icon name="camera" size={20} color="#fff" />
                    </Pressable>
                    </Pressable>
                </View>
                <Text style={styles.imageUploadText}>
                    {images.length < 5 ? `Add ${5 - images.length} Image${images.length === 1 ? '' : 's'}` : '5 Images Captured'}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#fff"
                    value={name}
                    onChangeText={setName}
                    editable={!loading} // Disable input while loading
                />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#fff"
                    value={username}
                    onChangeText={setUsername}
                    editable={!loading} // Disable input while loading
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#fff"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading} // Disable input while loading
                />

                <Pressable onPress={handleRegister} disabled={loading}>
                    <View style={[styles.registerButton, loading && styles.disabledButton]}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.registerButtonText}>Register</Text>
                        )}
                    </View>
                </Pressable>
               
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(100, 100, 100, 0.5)', // Optional: to darken the background image
    },
    headerText: {
        fontSize: 30,
        color: '#fff',
        marginBottom: 20,
        fontFamily: 'roboto-bold'
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
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    faceIconButton: {
        backgroundColor: '#12e3bf',
        borderRadius: 50,  // Adjusted for better round shape
        padding: 10,
        position: 'relative', // Needed for absolute positioning of camera icon
    },
    cameraIconButton: {
        backgroundColor: '#12e3bf',
        borderRadius: 15,
        padding: 5,
        position: 'absolute',
        bottom: -5,  // Adjusts the position at the bottom of the user icon
        right: -5,   // Adjusts the position at the right of the user icon
    },
    registerButton: {
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 5,
        backgroundColor: 'rgba(143,108,223,255)',
        fontFamily: 'roboto'
    },
    registerButtonText: {
        color: 'white',
        fontFamily: 'roboto'
    },
    loginText: {
        color: '#fff',
        marginTop: 20,
        fontFamily: 'roboto'
    },
    loginLink: {
        color: '#27c3ce',
    },
    disabledButton: {
        backgroundColor: '#8a8a8a',
    },
    instructionLink: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#be975f',
    },
    instructionText: {
        color: 'white',
        fontFamily: 'roboto'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
    },
    modalImage: {
        width: 100,
        height: 100,
        marginVertical: 20,
    },
    modalCloseButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#2196F3',
    },
    modalCloseText: {
        color: 'white',
        fontFamily: 'roboto'
    },
    imageUploadText: {
        color: 'white',
        fontFamily: 'roboto'
    },
});

export default RegisterScreen;
