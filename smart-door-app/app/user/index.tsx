import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const UserScreen = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://192.168.8.101:8000/admin/logs', {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch logs');
                }
                const logsData = await response.json();
                processLogs(logsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    useEffect(() => {
        const checkUserType = async () => {
            const userType = await AsyncStorage.getItem('userType');
            if (userType === 'ADMIN') {
                setIsAdmin(true);
            }
        };

        checkUserType();
    }, []);

    const processLogs = (logs) => {
        const userMap = new Map();
        logs.forEach(log => {
            const { username, log_type } = log;
            if (log_type === 'in') {
                userMap.set(username, true);
            } else if (log_type === 'out') {
                userMap.set(username, false);
            }
        });

        const filteredUsers = Array.from(userMap.entries())
            .filter(([_, inside]) => inside)
            .map(([username]) => ({ id: username, name: username }));

        setUsers(filteredUsers);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.backgroundImage}
                source={require('./../../assets/images/welcome.jpg')}
            />
            <View style={styles.overlay}>
                <Text style={styles.title}>Users Inside</Text>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.userBox}>
                            <Text style={styles.userName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    numColumns={2}
                    contentContainerStyle={styles.userList}
                />
            </View>
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton}>
                    <Icon name="home" size={24} color="#fff" />
                    <Text style={styles.navButtonText}>Home</Text>
                </TouchableOpacity>
                {isAdmin && (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => router.push('/admin')}>
                        <Icon name="cogs" size={24} color="#fff" />
                        <Text style={styles.navButtonText}>Admin</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => router.push('/login')}>
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
        backgroundColor: '#000', // Ensure a dark background to match overlay
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: 60,
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 35,
        color: '#fff',
        fontFamily: 'roboto-bold',
        marginBottom: 20,
    },
    userList: {
        flexGrow: 1,
        width: '90%',
    },
    userBox: {
        width: 150,
        padding: 15,
        margin: '2.5%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 90,
        backgroundColor: '#be975f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderColor: '#e0e0e0',
        borderWidth: 1,
    },
    userName: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'roboto-medium',
        textAlign: 'center',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#000000',
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
    errorText: {
        color: '#ff0000',
        fontSize: 18,
        fontFamily: 'roboto-medium',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default UserScreen;
