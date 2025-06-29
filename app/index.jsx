import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux"; // ✅ Redux dispatch
import logo from "../assets/images/logo.png";
import { auth, db } from "../firebase";
import { setTheme, setUser } from "../redux/userSlice"; // ✅ Actions

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch(); // ✅ Hook

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();

            // ✅ Store in Redux
            dispatch(setUser({ uid: user.uid, ...userData }));
            dispatch(setTheme(userData.isDark ?? false));

            // ✅ Navigate to home
            router.replace("/(tabs)");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center px-4">
          {/* Logo */}
          <Image
            source={logo}
            style={{ width: 200, height: 200, marginBottom: 20 }}
          />

          {/* App Name */}
          <Text className="text-white text-2xl font-bold mb-2 text-center">
            Farm Stock Manager
          </Text>

          {/* Description */}
          <Text className="text-gray-300 text-center mb-6">
            Manage your schedule, fertilizer stock, and more...
          </Text>

          {/* Buttons */}
          <View className="w-3/4">
            <TouchableOpacity
              className="p-2 my-2 bg-[#f49b33] rounded-lg"
              onPress={() => router.push("/signup")}
            >
              <Text className="text-lg font-semibold text-center text-black">
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/signin")}
              className="p-2 my-2 bg-white rounded-lg"
            >
              <Text className="text-lg font-semibold text-center text-black">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center py-4">
          <Text className="text-gray-500 text-sm">
            Powered by Vishal Parmar
          </Text>
        </View>

        <StatusBar barStyle="light-content" backgroundColor="#2b2b2b" />
      </ScrollView>
    </SafeAreaView>
  );
}
