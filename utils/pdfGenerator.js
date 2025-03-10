import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// ✅ Function to generate a Resume PDF
export const generateResumePDF = async (resumeData) => {
  try {
    const { fullName, email, phone, skills, experience, education, template } = resumeData;

    const workExperienceHTML = experience.map((exp) => `
      <div class="section">
        <h3>${exp.jobTitle} | ${exp.company}</h3>
        <p class="date">${exp.startDate} - ${exp.endDate}</p>
        <ul>${exp.responsibilities.map((resp) => `<li>${resp}</li>`).join("")}</ul>
      </div>
    `).join("");

    const educationHTML = education.map((edu) => `
      <div class="section">
        <h3>${edu.degree}, ${edu.university}</h3>
        <p class="date">${edu.startYear} - ${edu.endYear} | ${edu.location}</p>
        ${edu.gpa ? `<p><b>GPA:</b> ${edu.gpa}</p>` : ""}
        ${edu.coursework.length ? `<p><b>Relevant Coursework:</b> ${edu.coursework.join(", ")}</p>` : ""}
        ${edu.honors ? `<p><b>Honors & Achievements:</b> ${edu.honors}</p>` : ""}
      </div>
    `).join("");

    const skillsHTML = skills.length ? `<div class="section"><h3>Skills</h3><p>${skills.join(", ")}</p></div>` : "";

    // Different styles based on selected template
    const styles = {
      classic: `
        body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
        h1, h2, h3 { color: #333; }
      `,
      modern: `
        body { font-family: 'Helvetica', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { background: #fff; padding: 20px; border-radius: 8px; }
        h1, h2, h3 { color: #007bff; }
      `,
      professional: `
        body { font-family: 'Times New Roman', serif; padding: 20px; }
        h1, h2, h3 { color: black; text-transform: uppercase; }
      `,
    };

    const htmlContent = `
      <html>
      <head>
        <style>${styles[template] || styles.classic}</style>
      </head>
      <body>
        <div class="container">
          <h1>${fullName}</h1>
          <p>${email} | ${phone}</p>
          <hr/>
          ${workExperienceHTML}
          ${educationHTML}
          ${skillsHTML}
        </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });

    console.log("Resume PDF generated at:", uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing is not available on this device.");
    }
  } catch (error) {
    console.error("Error generating Resume PDF:", error);
  }
};

// ✅ Function to generate a Cover Letter PDF
export const generateCoverLetterPDF = async (coverLetterData) => {
  try {
    const { fullName, jobTitle, company, content } = coverLetterData;

    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
          .container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          h1, h2 { text-align: center; color: #333; }
          p { font-size: 16px; color: #444; text-align: justify; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Cover Letter</h2>
          <p><b>${fullName}</b></p>
          <p>Applying for: <b>${jobTitle}</b> at <b>${company}</b></p>
          <hr/>
          <p>${content.replace(/\n/g, "<br>")}</p>
        </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    console.log("Cover Letter PDF generated at:", uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing is not available on this device.");
    }
  } catch (error) {
    console.error("Error generating Cover Letter PDF:", error);
  }
};