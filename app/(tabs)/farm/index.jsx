import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function RelayControl() {
  const router = useRouter();
  const isDark = useSelector((state) => state.user.isDark);

  const [relayStatus, setRelayStatus] = useState({
    A: false,
    B: false,
    C: false,
    D: false,
  });
  const [lightAvailable, setLightAvailable] = useState(true); // Simulated as always available

  // Theme colors
  const bgColor = isDark ? "#0f0f0f" : "#f2f2f2";
  const cardColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";
  const accentColor = isDark ? "#bb86fc" : "#6200ee";
  const secondaryColor = isDark ? "#333333" : "#eeeeee";

  // Simulate relay toggle
  const toggleRelay = (key) => {
    setRelayStatus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={bgColor}
      />
      <ScrollView contentContainerStyle={{ padding: 20, marginTop: "10%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginRight: 10,
              padding: 6,
              borderRadius: 8,
              backgroundColor: secondaryColor,
            }}
          >
            <Ionicons name="arrow-back" size={22} color={textColor} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: textColor }}>
            Relay Controller
          </Text>
        </View>

        <Text
          style={{
            color: lightAvailable ? "green" : "red",
            fontSize: 16,
            marginBottom: 20,
            fontWeight: "600",
          }}
        >
          ⚡ Light: {lightAvailable ? "Available" : "Unavailable"}
        </Text>

        {["A", "B", "C", "D"].map((key) => (
          <View
            key={key}
            style={{
              backgroundColor: cardColor,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 18, color: textColor, fontWeight: "600" }}>
              Relay {key}
            </Text>
            <TouchableOpacity
              onPress={() => toggleRelay(key)}
              style={{
                backgroundColor: relayStatus[key] ? "#4CAF50" : "#F44336",
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {relayStatus[key] ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
