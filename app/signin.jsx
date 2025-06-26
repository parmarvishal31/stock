import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../assets/Colors";
import { auth, db } from "../firebase";

export default function SignIn() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!phone || !password) {
      Alert.alert("Missing Fields", "Please enter both phone and password.");
      return;
    }

    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phone", "==", phone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert("Phone Error", "No account found with this phone number.");
        return;
      }

      const userDoc = snapshot.docs[0].data();
      const email = userDoc.email;

      await signInWithEmailAndPassword(auth, email, password);

      router.replace("/");
    } catch (error) {
      console.error("SignIn Error:", error);

      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/user-not-found") {
        message = "No user found with these credentials.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      } else if (error.code === "auth/invalid-email") {
        message = "The email format is invalid.";
      }

      Alert.alert("Sign In Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 40,
        }}
      >
        {/* Logo */}
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 200, height: 200, marginBottom: 20 }}
          resizeMode="contain"
        />

        {/* Welcome Text */}
        <Text className="text-white text-3xl font-bold text-center mb-3">
          Welcome to <Text className="text-red-400">PomegranateFarm</Text>
        </Text>
        <Text className="text-gray-300 text-base text-center mb-8 px-4">
          Manage your schedule and fertilizer stock for easy farming.
        </Text>

        {/* Phone Input */}
        <TextInput
          className="rounded-lg p-3 mb-4 w-full"
          placeholder="Phone"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={{
            backgroundColor: "white",
            color: "black",
          }}
        />

        {/* Password Input */}
        <TextInput
          className="rounded-lg p-3 mb-6 w-full"
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: "white",
            color: "black",
          }}
        />

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : Colors.PRIMARY,
            width: "100%",
          }}
          className="p-3 rounded-lg mb-4"
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-center text-black font-semibold text-lg">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-center text-gray-300">
            Don’t have an account?{" "}
            <Text className="text-white underline">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer - Powered by */}
      <View className="absolute bottom-2 w-full items-center">
        <Text className="text-gray-400 text-xs">Powered by Vishal Parmar</Text>
      </View>
    </SafeAreaView>
  );
}
