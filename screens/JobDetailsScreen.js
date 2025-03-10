import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [updatedJob, setUpdatedJob] = useState(job);

  const updateJob = () => {
    console.log("Updated Job Details:", updatedJob);
    navigation.goBack(); // Navigate back after updating (Firebase later)
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Edit Job Application</Text>

      <Text>Job Title</Text>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
        value={updatedJob.jobTitle}
        onChangeText={(text) => setUpdatedJob({ ...updatedJob, jobTitle: text })}
      />

      <Text>Company</Text>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
        value={updatedJob.company}
        onChangeText={(text) => setUpdatedJob({ ...updatedJob, company: text })}
      />

      <Text>Date Applied</Text>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
        value={updatedJob.dateApplied}
        onChangeText={(text) => setUpdatedJob({ ...updatedJob, dateApplied: text })}
      />

      <Text>Status</Text>
      <Picker
        selectedValue={updatedJob.status}
        onValueChange={(itemValue) => setUpdatedJob({ ...updatedJob, status: itemValue })}
      >
        <Picker.Item label="Applied" value="Applied" />
        <Picker.Item label="Heard Back" value="Heard Back" />
        <Picker.Item label="Interviewed" value="Interviewed" />
        <Picker.Item label="Rejected" value="Rejected" />
        <Picker.Item label="Offer Received" value="Offer Received" />
      </Picker>

      <Button title="Save Changes" onPress={updateJob} />
    </View>
  );
};

export default JobDetailsScreen;