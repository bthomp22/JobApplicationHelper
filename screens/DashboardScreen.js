import React from "react";
import { View, Text, Button } from "react-native";

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Dashboard</Text>
      <Button title="Create Resume" onPress={() => navigation.navigate("Resume Builder")} />
      <Button title="Generate Cover Letter" onPress={() => navigation.navigate("Cover Letter")} />
    </View>
  );
};

export default DashboardScreen;