import { Text, View, TextInput, Alert } from "react-native";
import { Stack, Link } from "expo-router";
import { StyleSheet } from "react-native";
import { useState } from "react";
import Button from "@components/Button";
import Colors from "@constants/Colors";
import { supabase } from "@/lib/supabase";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert("Error; ", error.message);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sign up",
        }}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

      <Button
        text={loading ? "Creating account..." : "Create account"}
        disabled={loading}
        onPress={signUpWithEmail}
      />

      <Link href="/sign-in" style={styles.textButton}>
        Sign in
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  label: {
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default SignUpScreen;
