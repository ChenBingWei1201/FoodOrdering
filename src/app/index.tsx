import { View, Text } from "react-native";
import React from "react";
import Button from "@components/Button";
import { Link, Stack } from "expo-router";

const index = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Stack.Screen
        options={{
          title: "Sign in",
        }}
      />
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>
      <Link href={"/(auth)/sign-in"} asChild>
        <Button text="Sign in" />
      </Link>
    </View>
  );
};

export default index;
