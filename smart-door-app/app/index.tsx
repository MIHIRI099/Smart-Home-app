import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import React from "react";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#cccfe2', // Dark background for contrast
      }}
    >
      <View
        style={{
          alignItems: 'center',
          marginBottom: 50,
        }}
      >
        <View
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 2,
            marginTop:200
          }}
        >
          <Image
            source={require('./../assets/images/Home.png')} // Replace with your actual logo path
            style={{
              width: 220,
              height: 220,
            }}
          />
        </View>

        
        <Text
          style={{
            fontFamily: 'roboto-medium',
            color: '#0b0440',
            fontSize: 28,
            marginBottom: 5, 
            textAlign: 'center',
          }}
        >
          Welcome to Smart Door Authentication System !
        </Text>
      </View>

      <Pressable>
        <Link
          href={'/login'}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 60,
            borderRadius: 10,
            backgroundColor: '#6b7de4',  
            textAlign: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'roboto-medium',
              color: 'white',
              fontSize: 22,
              letterSpacing: 1,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Get Started
          </Text>
        </Link>
      </Pressable>
    </View>
  );
}
