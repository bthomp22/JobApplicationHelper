import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useForm, Controller } from "react-hook-form";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const JobTrackingScreen = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      jobTitle: "",
      company: "",
      dateApplied: "",
      status: "Applied",
      resumeId: "",
      coverLetterId: "",
    },
  });

  const [jobList, setJobList] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const navigation = useNavigation();

  // Fetch jobs from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const jobSnapshot = await getDocs(collection(db, "jobs"));
      setJobList(jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const resumeSnapshot = await getDocs(collection(db, "resumes"));
      setResumes(resumeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const coverLetterSnapshot = await getDocs(collection(db, "coverLetters"));
      setCoverLetters(coverLetterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  // Save job application to Firestore
  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "jobs"), data);
      setJobList([...jobList, data]); // Update UI
      reset(); // Clear form after submission
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Job Tracker</Text>

      <Text>Job Title</Text>
      <Controller
        control={control}
        name="jobTitle"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="Enter job title"
          />
        )}
      />

      <Text>Company</Text>
      <Controller
        control={control}
        name="company"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="Enter company name"
          />
        )}
      />

      <Text>Date Applied</Text>
      <Controller
        control={control}
        name="dateApplied"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="YYYY-MM-DD"
          />
        )}
      />

      <Text>Application Status</Text>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange}>
            <Picker.Item label="Applied" value="Applied" />
            <Picker.Item label="Heard Back" value="Heard Back" />
            <Picker.Item label="Interviewed" value="Interviewed" />
            <Picker.Item label="Rejected" value="Rejected" />
            <Picker.Item label="Offer Received" value="Offer Received" />
          </Picker>
        )}
      />

      <Text>Select Resume</Text>
      <Controller
        control={control}
        name="resumeId"
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange}>
            <Picker.Item label="Select Resume" value="" />
            {resumes.map((resume) => (
              <Picker.Item key={resume.id} label={resume.title || "Untitled Resume"} value={resume.id} />
            ))}
          </Picker>
        )}
      />

      <Text>Select Cover Letter</Text>
      <Controller
        control={control}
        name="coverLetterId"
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange}>
            <Picker.Item label="Select Cover Letter" value="" />
            {coverLetters.map((letter) => (
              <Picker.Item key={letter.id} label={`For ${letter.jobTitle}`} value={letter.id} />
            ))}
          </Picker>
        )}
      />

      <Button title="Save Job" onPress={handleSubmit(onSubmit)} />

      {/* Display Saved Jobs */}
      {jobList.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Saved Jobs</Text>
          {jobList.map((job, index) => (
            <View key={index} style={{ padding: 10, borderBottomWidth: 1, marginTop: 5 }}>
              <Text>{job.jobTitle} at {job.company}</Text>
              <Text>Date Applied: {job.dateApplied}</Text>
              <Text>Status: {job.status}</Text>
              <Text>Resume: {job.resumeId ? "Linked" : "Not Linked"}</Text>
              <Text>Cover Letter: {job.coverLetterId ? "Linked" : "Not Linked"}</Text>
              <Button title="Edit" onPress={() => navigation.navigate("Job Details", { job })} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default JobTrackingScreen;