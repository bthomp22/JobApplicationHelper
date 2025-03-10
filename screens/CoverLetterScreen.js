import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { OPENAI_API_KEY } from "@env";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { generateCoverLetterPDF } from "../utils/pdfGenerator";

const CoverLetterScreen = () => {
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      fullName: "",
      jobTitle: "",
      company: "",
      experience: "",
      skills: "",
    },
  });

  const [coverLetters, setCoverLetters] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which cover letter is being edited
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch saved cover letters from Firestore
  useEffect(() => {
    const fetchCoverLetters = async () => {
      const coverLetterSnapshot = await getDocs(collection(db, "coverLetters"));
      setCoverLetters(coverLetterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCoverLetters();
  }, []);

  // Save or update cover letter
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setCoverLetter(""); // Reset previous cover letter

      const prompt = `
        Write a professional and engaging cover letter for ${data.fullName},
        applying for the ${data.jobTitle} position at ${data.company}.
        Key experience: ${data.experience}.
        Relevant skills: ${data.skills}.
        Make it personalized and compelling.
      `;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
        }),
      });

      const result = await response.json();
      const generatedText = result.choices[0]?.message?.content.trim();
      setCoverLetter(generatedText);

      if (editingId) {
        // Update existing cover letter
        const coverLetterRef = doc(db, "coverLetters", editingId);
        await updateDoc(coverLetterRef, { ...data, content: generatedText });

        // Update state with new cover letter data
        setCoverLetters((prevCoverLetters) =>
          prevCoverLetters.map((cl) =>
            cl.id === editingId ? { id: editingId, ...data, content: generatedText } : cl
          )
        );

        setEditingId(null); // Exit editing mode
      } else {
        // Save new cover letter to Firestore
        const docRef = await addDoc(collection(db, "coverLetters"), { ...data, content: generatedText });

        setCoverLetters((prevCoverLetters) => [
          ...prevCoverLetters,
          { id: docRef.id, ...data, content: generatedText },
        ]);
      }

      // Reset the form fields
      reset({
        fullName: "",
        jobTitle: "",
        company: "",
        experience: "",
        skills: "",
      });

    } catch (error) {
      console.error("Error generating cover letter:", error);
      setCoverLetter("An error occurred. Please try again.");
    }
    
    setLoading(false);
  };

  // Load selected cover letter into form for editing
  const editCoverLetter = (coverLetter) => {
    setEditingId(coverLetter.id);
    reset(coverLetter); // Load the selected cover letter into form
    setCoverLetter(coverLetter.content);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Cover Letter Generator</Text>

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

      <Text>Company Name</Text>
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

      <Text>Experience Summary</Text>
      <Controller
        control={control}
        name="experience"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="Enter brief experience summary"
            multiline
          />
        )}
      />

      <Text>Skills</Text>
      <Controller
        control={control}
        name="skills"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            onChangeText={onChange}
            value={value}
            placeholder="Enter skills (comma-separated)"
          />
        )}
      />

      <Button title={editingId ? "Update Cover Letter" : "Generate Cover Letter"} onPress={handleSubmit(onSubmit)} disabled={loading} />

      {loading ? <Text>Generating...</Text> : coverLetter ? (
        <>
          <Text style={{ marginTop: 20 }}>{coverLetter}</Text>
          <Button title="Export as PDF" onPress={() => generatePDF("Cover Letter", coverLetter)} />
        </>
      ) : null}

      {/* List of Saved Cover Letters */}
      {coverLetters.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Saved Cover Letters</Text>
          {coverLetters.map((cl) => (
            <View key={cl.id} style={{ padding: 10, borderBottomWidth: 1, marginTop: 5 }}>
              <Text>For {cl.jobTitle} at {cl.company}</Text>
              <Button title="Edit" onPress={() => editCoverLetter(cl)} />
              <Button title="Export as PDF" onPress={() => generateCoverLetterPDF({ fullName: data.fullName, jobTitle: data.jobTitle, company: data.company, content: coverLetter })} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default CoverLetterScreen;