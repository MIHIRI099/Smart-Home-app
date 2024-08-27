import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from "expo-router"; // Adjust the import according to your navigation library

const Dashboard = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) setUsername(storedUsername);
        };

        loadUserData();
    }, []);

    return (
        <View style={styles.container}>
            <Image
                style={styles.backgroundImage}
                source={require('./../../assets/images/background.jpeg')} // Background image path
            />
            <View style={styles.overlay}>
     
            <Text style={styles.title}>Welcome, {username}</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/register')}>
                        <Text style={styles.actionButtonText}>Register Users</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/logs')}>
                        <Text style={styles.actionButtonText}>View User Logs</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.doorButton}
                        onPress={() => router.push('/camara')}>
                        <Text style={styles.actionButtonText}>View Front Door</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.navBar}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={async () => {
                        await AsyncStorage.clear();
                        router.push('/login');
                    }}>
                    <Icon name="sign-out" size={24} color="#fff" />
                    <Text style={styles.navButtonText}>Logout</Text>
                </TouchableOpacity>
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
        backgroundColor: 'rgba(100, 100, 100, 0.4)',
        paddingTop: 60,
    },
    title: {
        fontSize: 35,
        color: '#fff',
        fontFamily: 'roboto-bold',
        marginBottom: 20,
    },
    buttonsContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#6b7de4',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginVertical: 10,
    },
    doorButton: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#985cc7',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginVertical: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'roboto-medium',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#5956b4', // Updated background color
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#333',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    
    navButton: {
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'roboto-medium',
        marginTop: 5,
    },
});

export default Dashboard;
