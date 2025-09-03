require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

const systemInstruction = {
  role: "system",
  parts: [{
    text: `You are a professional code reviewer. 
Review the following code and provide feedback in a clear, structured format. 
Make the review short, simple, and visually easy to read.

Format your response as follows:
### ✅ Overview
- Brief summary of what the code does


- List of good practices or things done well

### ⚠️ Issues
- Clear bullet points of problems, errors, or risks

### 💡 Suggestions
- Short improvement tips or best practices

### 📝 Example Fix (if needed)
\`\`\`javascript`
  }]
};

exports.generateReview = async function(code) {
  const userContent = {
    role: "user",
    parts: [{
      text: `Please review the following code:\n\n${code}`
    }]
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    systemInstruction,
    contents: [userContent]
  });

  return response.text;
};
