import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Button, Image} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from "expo-router";

const LogsScreen = () => {
    
    const [logs, setLogs] = useState([]);
    
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);


    useEffect(() => {
        const fetchLogs = async () => {
            // Simulating an API call with dummy data
            const logsData = [
                {
                    id: 1,
                    timestamp: new Date().toISOString(),
                    username: 'user1',
                    log_type: 'in',
                },
               
                {
                    id: 3,
                    timestamp: new Date().toISOString(),
                    username: 'user3',
                    log_type: 'in',
                },
                
                {
                    id: 5,
                    timestamp: new Date().toISOString(),
                    username: 'user5',
                    log_type: 'in',
                },
            ];
    
            setLogs(logsData);
            filterLogsByDate(logsData, selectedDate);
            setLoading(false);
        };
    
        fetchLogs();
    }, [selectedDate]);
    

    const filterLogsByDate = (logsData: any[], date: Date) => {
        const filtered = logsData.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.toDateString() === date.toDateString();
        });
        // @ts-ignore
        setFilteredLogs(filtered);
    };

    // @ts-ignore
    const handleDateChange = (event, date) => {
        if (date) {
            setSelectedDate(date);
            setShowDatePicker(false);
            filterLogsByDate(logs, date);
        }
    };

    // @ts-ignore
    const renderLogItem = ({ item }) => {
        const formattedDate = new Date(item.timestamp).toLocaleDateString();
        const formattedTime = new Date(item.timestamp).toLocaleTimeString();
        const logTypeStyles = item.log_type === 'in' ? styles.inLog : styles.outLog;

        return (
            <View style={[styles.logItem, logTypeStyles]}>
                <View>
                    <Text style={styles.logDate}>{formattedDate}</Text>
                    <Text style={styles.logTime}>{formattedTime}</Text>
                </View>
                <Text style={styles.logUsername}>{item.username}</Text>
                <View style={styles.logArrowContainer}>
                    <Icon
                        name={item.log_type === 'in' ? 'sign-in' : 'sign-out'}
                        size={24}
                        color="#fff"
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.backgroundImage}
                source={require('./../../assets/images/background.jpeg')} // Background image path
            />
            <View style={styles.overlay}>
                <Text style={styles.title}>Activity History</Text>
                <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                    <Icon name="calendar" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Select Date</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                {loading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                    <FlatList
                        data={filteredLogs}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderLogItem}
                        contentContainerStyle={styles.logList}
                    />
                )}
            </View>
            <View style={styles.navBar}>
                    <TouchableOpacity style={styles.navButton}
                        onPress={() => router.push('/admin')}>
                        <Icon name="home" size={24} color="#fff" />
                        <Text style={styles.navButtonText}>Home</Text>
                    </TouchableOpacity>
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
        fontSize: 40,
        color: '#fff',
        fontFamily: 'roboto-bold',
        marginBottom: 10,
    },
    logList: {
        width: '90%',
    },
    logItem: {
        padding: 15,
        paddingLeft:40,
        paddingRight:40,
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9f5bc6',
        borderColor: '#444',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    logDate: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'roboto-medium',
    },
    logTime: {
        fontSize: 18,
        color: '#ccc',
        fontFamily: 'roboto',
    },
    logUsername: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'roboto-medium',
        marginHorizontal: 10,
    },
    logArrowContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inLog: {
        backgroundColor: '#9f5bc6', // Green for 'in'
    },
    outLog: {
        backgroundColor: '#FF9800', // Orange for 'out'
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
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',  // Align icon and text in a row
        margin: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'roboto-medium',
        marginLeft: 10,  // Add space between icon and text
    }
});

export default LogsScreen;
