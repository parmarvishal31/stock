import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Formik } from "formik";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { Colors } from "../assets/Colors";
import { auth, db } from "../firebase";

// Validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const router = useRouter();

  const handleSignUp = async (values, { setSubmitting }) => {
    try {
      // Check for duplicate phone number
      const q = query(
        collection(db, "users"),
        where("phone", "==", values.phone)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert(
          "Phone number already in use",
          "Please use a different phone number."
        );
        setSubmitting(false);
        return;
      }

      // Create user with Firebase Auth
      const { user } = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Send email verification
      await sendEmailVerification(user);

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: "farmer",
        isDark: false,
      });

      Alert.alert(
        "Verify Email",
        "A verification link has been sent to your email. Please verify your email before signing in."
      );

      router.push("/signin");
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingBottom: 60,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <Image
              source={require("../assets/images/logo.png")}
              style={{ width: 200, height: 200, marginBottom: 20 }}
              resizeMode="contain"
            />

            {/* Heading */}
            <Text className="text-white text-3xl font-bold text-center mb-2">
              Create Account
            </Text>

            {/* Line */}
            <View
              style={{
                height: 2,
                backgroundColor: "#fff",
                width: 120,
                marginBottom: 12,
              }}
            />

            {/* Description */}
            <Text className="text-gray-300 text-xl text-center mb-6 px-4">
              <Text className="text-red-400 font-bold">
                Welcome to PomegranateFarm
              </Text>{" "}
              — create your account to manage schedules and fertilizer stock for
              easy farming.
            </Text>

            {/* Formik Form */}
            <Formik
              initialValues={{ name: "", email: "", phone: "", password: "" }}
              validationSchema={SignupSchema}
              onSubmit={handleSignUp}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <View className="w-full">
                  <TextInput
                    className="bg-white rounded-lg p-3 mb-2"
                    placeholder="Name"
                    placeholderTextColor="#999"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />
                  {touched.name && errors.name && (
                    <Text className="text-red-400 mb-2">{errors.name}</Text>
                  )}

                  <TextInput
                    className="bg-white rounded-lg p-3 mb-2"
                    placeholder="Email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  {touched.email && errors.email && (
                    <Text className="text-red-400 mb-2">{errors.email}</Text>
                  )}

                  <TextInput
                    className="bg-white rounded-lg p-3 mb-2"
                    placeholder="Phone"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                  />
                  {touched.phone && errors.phone && (
                    <Text className="text-red-400 mb-2">{errors.phone}</Text>
                  )}

                  <TextInput
                    className="bg-white rounded-lg p-3 mb-2"
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-400 mb-2">{errors.password}</Text>
                  )}

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isSubmitting ? "#ccc" : Colors.PRIMARY,
                    }}
                    className="p-3 rounded-lg mt-4 mb-4"
                  >
                    <Text className="text-center text-black font-semibold text-lg">
                      {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => router.push("/signin")}>
                    <Text className="text-center text-gray-300">
                      Already have an account?{" "}
                      <Text className="text-white underline">Sign In</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View className="absolute bottom-2 w-full items-center">
        <Text className="text-gray-400 text-xs">Powered by Vishal Parmar</Text>
      </View>
    </SafeAreaView>
  );
}
