import * as Linking from "expo-linking"; // for opening email app
import { useRouter } from "expo-router";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../assets/Colors";
import { auth, db } from "../firebase";

export default function SignIn() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!identifier || !password) {
      Alert.alert(
        "Missing Fields",
        "Please enter your email/phone and password."
      );
      return;
    }

    setLoading(true);

    try {
      let emailToUse = identifier;

      // If input is a phone number, find email from Firestore
      const isPhone = /^[0-9]{10}$/.test(identifier);
      if (isPhone) {
        const q = query(
          collection(db, "users"),
          where("phone", "==", identifier)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          Alert.alert(
            "Sign In Failed",
            "No user found with this phone number."
          );
          setLoading(false);
          return;
        }

        const userData = snapshot.docs[0].data();
        emailToUse = userData.email;
      }

      const { user } = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        password
      );

      // Check if email is verified
      await user.reload(); // refresh data
      if (!user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before continuing.",
          [
            {
              text: "Resend Email",
              onPress: async () => {
                try {
                  await sendEmailVerification(user);
                  Alert.alert(
                    "Verification Sent",
                    "Check your inbox or spam folder.",
                    [
                      {
                        text: "Open Email App",
                        onPress: () => {
                          Linking.openURL("mailto:");
                        },
                      },
                      { text: "OK", style: "cancel" },
                    ]
                  );
                } catch (e) {
                  console.error("Resend Error:", e);
                  Alert.alert("Error", "Failed to resend verification email.");
                }
              },
            },
            { text: "OK", style: "cancel" },
          ]
        );
        return;
      }

      router.replace("/");
    } catch (error) {
      console.error("SignIn Error:", error);

      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/user-not-found") {
        message = "No user found with these credentials.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try later.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format.";
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

        {/* Email or Phone Input */}
        <TextInput
          className="rounded-lg p-3 mb-4 w-full"
          placeholder="Email or Phone"
          placeholderTextColor="#999"
          value={identifier}
          onChangeText={setIdentifier}
          keyboardType="email-address"
          autoCapitalize="none"
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
    </SafeAreaView>
  );
}
