import { ActivityIndicator, View } from "react-native";
import React from "react";
import Button from "@components/Button";
import { Link, Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

const index = () => {
  const { session, loading, isAdmin } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) { // if not signed in
    return <Redirect href={"/sign-in"} />; // redirect to sign in page
  }

  if (!isAdmin) { // if not admin
    return <Redirect href={"/(user)"} />; // redirect to user page
  }

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
      <Button text="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
};

export default index;
