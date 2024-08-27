import React from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

const WaitingScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.backgroundImage}
                source={require('./../../assets/images/welcome.jpg')} // Make sure you have this image in the specified path
            />
            <View style={styles.overlay}>
                <Text style={styles.title}>Please Wait</Text>
                <Text style={styles.message}>
                    Your account is pending approval from an admin. You will be redirect to the home page once it is approved.
                </Text>
                <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} />
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Optional: to darken the background image
        padding: 20,
    },
    title: {
        fontSize: 35,
        color: '#fff',
        fontFamily: 'roboto-bold',
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'roboto',
        textAlign: 'center',
        marginBottom: 30,
    },
    spinner: {
        marginBottom: 20,
    },
    link: {
        fontSize: 16,
        color: '#be975f',
        fontFamily: 'roboto',
    },
});

export default WaitingScreen;
