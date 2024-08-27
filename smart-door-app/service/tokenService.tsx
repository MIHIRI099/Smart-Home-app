import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveTokens(accessToken: string, refreshToken: string) {
    try {
        await AsyncStorage.multiSet([
            ['@accessToken', accessToken],
            ['@refreshToken', refreshToken],
        ]);
    } catch (e) {
        console.error('Failed to save tokens:', e);
    }
}

export async function getAccessToken() {
    try {
        return await AsyncStorage.getItem('@accessToken');
    } catch (e) {
        console.error('Failed to get access token:', e);
        return null;
    }
}

export async function getRefreshToken() {
    try {
        return await AsyncStorage.getItem('@refreshToken');
    } catch (e) {
        console.error('Failed to get refresh token:', e);
        return null;
    }
}

export async function clearTokens() {
    try {
        await AsyncStorage.multiRemove(['@accessToken', '@refreshToken']);
    } catch (e) {
        console.error('Failed to clear tokens:', e);
    }
}
