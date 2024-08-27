import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'roboto': require('./../assets/fonts/Roboto-Regular.ttf'),
        'roboto-medium': require('./../assets/fonts/Roboto-Medium.ttf'),
        'roboto-bold': require('./../assets/fonts/Roboto-Bold.ttf'),
    });

    const [appIsReady, setAppIsReady] = useState(false);

    // Prevent the splash screen from auto-hiding
    useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
            } catch (e) {
                console.warn(e);
            }
        }

        prepare();
    }, []);

    // Check if fonts are loaded and then hide the splash screen
    useEffect(() => {
        if (fontsLoaded) {
            setAppIsReady(true);
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    // Ensure hooks are not conditionally rendered
    if (!appIsReady) {
        return null; // Render nothing until the app is ready
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login/index" options={{ headerShown: false }} />
            <Stack.Screen name="register/index" options={{ headerShown: false }} />
            <Stack.Screen name="admin/index" options={{ headerShown: false }} />
            <Stack.Screen name="logs/index" options={{ headerShown: false }} />
            <Stack.Screen name="camara/index" options={{ headerShown: false }} />
        </Stack>
    );
}
