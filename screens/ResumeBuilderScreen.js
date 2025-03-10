import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import picker for template selection
import { useForm, Controller } from "react-hook-form";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { generateResumePDF } from "../utils/pdfGenerator";

const ResumeBuilderScreen = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      fullName: "",
      email: "",
      phone: "",
      skills: "",
      experience: [],
      education: [],
      template: "classic", // Default template selection
    },
  });

  const [resumes, setResumes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [workExperience, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic"); // Track template selection

  useEffect(() => {
    const fetchResumes = async () => {
      const resumeSnapshot = await getDocs(collection(db, "resumes"));
      setResumes(resumeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchResumes();
  }, []);

  const onSubmit = async (data) => {
    const updatedData = { 
      ...data,
      skills: skills.split(",").map(skill => skill.trim()), // Convert skills to array
      experience: workExperience,
      education: education,
      template: selectedTemplate, // Store selected template
    };

    try {
      if (editingId) {
        const resumeRef = doc(db, "resumes", editingId);
        await updateDoc(resumeRef, updatedData);
        setResumes((prevResumes) =>
          prevResumes.map((resume) =>
            resume.id === editingId ? { id: editingId, ...updatedData } : resume
          )
        );
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, "resumes"), updatedData);
        setResumes((prevResumes) => [
          ...prevResumes,
          { id: docRef.id, ...updatedData },
        ]);
      }

      reset();
      setWorkExperience([]);
      setEducation([]);
      setSkills("");
    } catch (error) {
      console.error("Error saving/updating resume:", error);
    }
  };

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, { jobTitle: "", company: "", startDate: "", endDate: "", responsibilities: [] }]);
  };

  const updateWorkExperience = (index, field, value) => {
    const updatedExperience = [...workExperience];
    updatedExperience[index][field] = value;
    setWorkExperience(updatedExperience);
  };

  const addResponsibility = (index, responsibility) => {
    const updatedExperience = [...workExperience];
    updatedExperience[index].responsibilities.push(responsibility);
    setWorkExperience(updatedExperience);
  };

  const addEducation = () => {
    setEducation([...education, {
      degree: "",
      university: "",
      location: "",
      startYear: "",
      endYear: "",
      gpa: "",
      coursework: [],
      honors: "",
    }]);
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const addCoursework = (index, course) => {
    const updatedEducation = [...education];
    updatedEducation[index].coursework.push(course);
    setEducation(updatedEducation);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Resume Builder</Text>

      <Text>Resume Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="Enter resume title"
          />
        )}
      />

      <Text>Full Name</Text>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="Enter full name"
          />
        )}
      />

      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="Enter email"
          />
        )}
      />

      <Text>Phone</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        )}
      />

      <Text>Select Resume Template</Text>
      <Picker selectedValue={selectedTemplate} onValueChange={(itemValue) => setSelectedTemplate(itemValue)}>
        <Picker.Item label="Classic" value="classic" />
        <Picker.Item label="Modern" value="modern" />
        <Picker.Item label="Professional" value="professional" />
      </Picker>

      <Button title="Save Resume" onPress={handleSubmit(onSubmit)} />

      {resumes.map((resume) => (
        <View key={resume.id} style={{ padding: 10, borderBottomWidth: 1, marginTop: 5 }}>
          <Text>{resume.title}</Text>
          <Button title="Export as PDF" onPress={() => generateResumePDF(resume)} />
        </View>
      ))}
    </ScrollView>
  );
};

export default ResumeBuilderScreen;