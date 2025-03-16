import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API route handler for the loan advisor
export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY || !process.env.SARVAM_API_KEY) {
      return NextResponse.json({ error: "API keys not configured" }, { status: 500 });
    }

    const { prompt, language = "English", conversationHistory = [] } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let translatedPrompt = prompt;
    
    // Step 1: If not English, translate the prompt to English for the LLM
    if (language !== "en-IN" && language !== "English") {
      try {
        translatedPrompt = await translateText(prompt, language, "en-IN");
        console.log("Translated prompt:", translatedPrompt);
      } catch (error) {
        console.error("Translation error:", error);
        // Continue with original prompt if translation fails
      }
    }
    
    // Step 2: Use Sarvam Text Analytics to analyze user intent
    const intentData = await analyzeUserIntent(translatedPrompt);
    
    // Step 3: Generate appropriate response using Gemini based on the detected intent and conversation history
    const englishResponse = await generateLoanResponse(translatedPrompt, intentData, language, conversationHistory);
    
    // Step 4: If not English, translate the response back to the user's language
    let finalResponse = englishResponse;
    if (language !== "en-IN" && language !== "English") {
      try {
        finalResponse = await translateText(englishResponse, "en-IN", language);
        console.log("Translated response:", finalResponse);
      } catch (error) {
        console.error("Translation error:", error);
        // Continue with English response if translation fails
        finalResponse = englishResponse;
      }
    }
    
    // Step 5: Update conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: prompt },
      { role: "assistant", content: finalResponse }
    ];
    
    return NextResponse.json({ 
      output: finalResponse,
      detectedIntent: intentData.intent,
      confidenceScore: intentData.confidence,
      conversationHistory: updatedHistory
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to process financial information request" 
    }, { status: 500 });
  }
}

// Translation function
async function translateText(text, sourceLang, targetLang) {
  try {
    const response = await fetch("https://api.sarvam.ai/v1/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY
      },
      body: JSON.stringify({
        input: text,
        source_language_code: sourceLang,
        target_language_code: targetLang,
        model: "bulbul:v1"
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

async function analyzeUserIntent(text) {
  const questions = JSON.stringify([
    {
      id: "intent",
      text: "What is the primary intent of this user query?",
      type: "enum",
      properties: {
        options: [
          "loan_eligibility_check", 
          "loan_application_guidance", 
          "financial_literacy_tips",
          "student_loan_information",
          "general_inquiry"
        ]
      }
    },
    {
      id: "loan_type",
      text: "What type of loan is the user interested in, if any?",
      type: "enum",
      properties: {
        options: [
          "personal_loan", 
          "home_loan", 
          "auto_loan", 
          "education_loan", 
          "student_loan",
          "business_loan",
          "credit_card",
          "not_specified"
        ]
      }
    },
    {
      id: "financial_details",
      text: "What financial details did the user provide?",
      type: "short answer"
    },
    {
      id: "student_details",
      text: "If the user is a student, what educational details did they mention?",
      type: "short answer"
    }
  ]);

  try {
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('questions', questions);

    const response = await fetch('https://api.sarvam.ai/text-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'api-subscription-key': process.env.SARVAM_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Sarvam API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the intent and other relevant information
    const intentAnswer = data.answers.find(a => a.id === "intent");
    const loanTypeAnswer = data.answers.find(a => a.id === "loan_type");
    const financialDetailsAnswer = data.answers.find(a => a.id === "financial_details");
    const studentDetailsAnswer = data.answers.find(a => a.id === "student_details");
    
    return {
      intent: intentAnswer?.response || "general_inquiry",
      loanType: loanTypeAnswer?.response || "not_specified",
      financialDetails: financialDetailsAnswer?.response || "",
      studentDetails: studentDetailsAnswer?.response || "",
      confidence: 0.85, // This would ideally come from the API
      reasoning: intentAnswer?.reasoning || ""
    };
  } catch (error) {
    console.error("Error analyzing intent with Sarvam:", error);
    // Fallback to basic intent detection
    return detectBasicIntent(text);
  }
}

// Fallback function for basic intent detection
function detectBasicIntent(text) {
  const lowercaseText = text.toLowerCase();
  
  // Student loan specific detection
  if (/student\s+loan|education\s+loan|college\s+loan|university\s+loan|school\s+loan/i.test(lowercaseText)) {
    if (/eligib|qualify|approval|can\s+i\s+get|chances|how\s+much\s+can\s+i\s+borrow/i.test(lowercaseText)) {
      return {
        intent: "loan_eligibility_check",
        loanType: "student_loan",
        financialDetails: "",
        studentDetails: extractStudentDetails(lowercaseText),
        confidence: 0.7,
        reasoning: "Detected student loan eligibility query"
      };
    } else {
      return {
        intent: "student_loan_information",
        loanType: "student_loan",
        financialDetails: "",
        studentDetails: extractStudentDetails(lowercaseText),
        confidence: 0.7,
        reasoning: "Detected student loan query"
      };
    }
  }
  
  // General intent detection
  if (/eligib|qualify|approval|can\s+i\s+get|chances|how\s+much\s+can\s+i\s+borrow/i.test(lowercaseText)) {
    return {
      intent: "loan_eligibility_check",
      loanType: detectLoanType(lowercaseText),
      financialDetails: "",
      studentDetails: "",
      confidence: 0.6,
      reasoning: "Detected eligibility-related keywords in query"
    };
  } 
  else if (/apply|application|documents|process|steps|how\s+to\s+get|paperwork/i.test(lowercaseText)) {
    return {
      intent: "loan_application_guidance",
      loanType: detectLoanType(lowercaseText),
      financialDetails: "",
      studentDetails: "",
      confidence: 0.6,
      reasoning: "Detected application-related keywords in query"
    };
  }
  else if (/tips|improve|credit\s+score|financial\s+advice|savings|budget|manage/i.test(lowercaseText)) {
    return {
      intent: "financial_literacy_tips",
      loanType: "not_specified",
      financialDetails: "",
      studentDetails: "",
      confidence: 0.6,
      reasoning: "Detected financial literacy-related keywords in query"
    };
  }
  
  return {
    intent: "general_inquiry",
    loanType: detectLoanType(lowercaseText),
    financialDetails: "",
    studentDetails: "",
    confidence: 0.4,
    reasoning: "No specific intent detected"
  };
}

// Helper function to detect loan type from text
function detectLoanType(text) {
  if (/student|education|college|university|school/i.test(text)) return "student_loan";
  if (/home|mortgage|property|house/i.test(text)) return "home_loan";
  if (/car|auto|vehicle/i.test(text)) return "auto_loan";
  if (/business|startup|company|enterprise/i.test(text)) return "business_loan";
  if (/personal|individual/i.test(text)) return "personal_loan";
  if (/credit\s+card/i.test(text)) return "credit_card";
  return "not_specified";
}

// Helper function to extract potential student details
function extractStudentDetails(text) {
  let details = [];
  
  // Extract education level
  if (/undergraduate|bachelor|graduate|master|phd|doctorate/i.test(text)) {
    const matches = text.match(/undergraduate|bachelor|graduate|master|phd|doctorate/i);
    if (matches) details.push(`Education level: ${matches[0]}`);
  }
  
  // Extract university/college if mentioned
  const uniRegex = /at\s+([A-Za-z\s]+university|[A-Za-z\s]+college)/i;
  const uniMatch = text.match(uniRegex);
  if (uniMatch) details.push(`Institution: ${uniMatch[1]}`);
  
  // Extract year/semester if mentioned
  const yearRegex = /(first|second|third|fourth|final)\s+(year|semester)/i;
  const yearMatch = text.match(yearRegex);
  if (yearMatch) details.push(`Year: ${yearMatch[0]}`);
  
  return details.join(', ');
}

// Function to generate response using Gemini based on detected intent and conversation history
async function generateLoanResponse(userQuery, intentData, language, conversationHistory) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a system prompt based on the detected intent
    let systemPrompt;
    
    switch (intentData.intent) {
      case "loan_eligibility_check":
        if (intentData.loanType === "student_loan" || intentData.loanType === "education_loan") {
          systemPrompt = `You are a helpful student loan advisor. The user has asked: "${userQuery}"
          
          Our analysis shows they're interested in checking eligibility for a student loan.
          
          Student details detected: ${intentData.studentDetails || "None provided"}
          Financial details detected: ${intentData.financialDetails || "None provided"}
          
          Respond as a friendly student loan advisor. If they haven't provided enough information about their:
          - Current education level (undergraduate, graduate, etc.)
          - Institution name
          - Course of study
          - Academic performance
          - Financial need
          - Cosigner availability (if relevant)
          
          Ask follow-up questions about these details.
          
          Explain what factors are important for student loan eligibility, including:
          - Government-backed vs private student loans
          - Need-based vs merit-based options
          - Eligibility requirements specific to their situation
          
          Respond using clear, simple language suitable for students.`;
        } else {
          systemPrompt = `You are a helpful loan eligibility advisor. The user has asked: "${userQuery}"
          
          Our analysis shows they're interested in checking eligibility for a ${intentData.loanType === "not_specified" ? "loan" : intentData.loanType.replace("_", " ")}.
          
          Financial details detected: ${intentData.financialDetails || "None provided"}
          
          Respond as a friendly loan advisor. If they haven't provided enough information about their income, credit score, employment status, or existing debts, ask follow-up questions.
          
          Explain what factors are important for loan eligibility and provide guidance on improving chances of approval.
          
          Respond using clear, simple language without financial jargon.`;
        }
        break;
      
    case "loan_application_guidance":
      if (intentData.loanType === "student_loan" || intentData.loanType === "education_loan") {
        systemPrompt = `You are a student loan application guide. The user has asked: "${userQuery}"
        
        Our analysis shows they're interested in the application process for a student loan.
        
        Student details detected: ${intentData.studentDetails || "None provided"}
        
        Respond as a helpful student loan advisor explaining the step-by-step application process.
        Include:
        1. Different types of student loans available (federal, private)
        2. Required documents (FAFSA for federal loans, proof of enrollment, ID, etc.)
        3. Application deadlines and timeframes
        4. Tips specific to student loans (applying for scholarships first, understanding loan terms)
        5. Repayment options and grace periods
        
         Respond using clear, simple language without financial jargon.`;
      } else {
        systemPrompt = `You are a loan application process guide. The user has asked: "${userQuery}"
        
        Our analysis shows they're interested in the application process for a ${intentData.loanType === "not_specified" ? "loan" : intentData.loanType.replace("_", " ")}.
        
        Respond as a helpful loan advisor explaining the step-by-step application process.
        Include:
        1. Required documents
        2. Information they'll need to provide
        3. Typical timeframes for approval
        4. Tips to make the application process smoother
        
         Respond using clear, simple language without financial jargon.`;
      }
      break;
      
    case "student_loan_information":
      systemPrompt = `You are a student loan specialist. The user has asked: "${userQuery}"
      
      Student details detected: ${intentData.studentDetails || "None provided"}
      
      Provide helpful information about student loans, including:
      1. Different types of student loans (federal vs private)
      2. Interest rates and how they work
      3. Repayment options and grace periods
      4. Loan forgiveness programs if relevant
      5. How to minimize student debt
      
      If they haven't provided enough information about their specific situation, ask clarifying questions to provide more personalized guidance.
      
       Respond using clear, simple language without financial jargon.`;
      break;
      
    case "financial_literacy_tips":
      if (intentData.loanType === "student_loan" || intentData.loanType === "education_loan" || /student|college|university/i.test(userQuery)) {
        systemPrompt = `You are a financial literacy coach for students. The user has asked: "${userQuery}"
        
        Provide practical, actionable financial tips relevant to students, such as:
        - Managing student loans responsibly
        - Budgeting on a student income
        - Building credit as a student
        - Finding student discounts and saving money
        - Balancing work and study
        - Emergency funds for students
        
        Explain financial concepts in simple terms suitable for students. Offer small, achievable steps they can take.
        
         Respond using clear, simple language without financial jargon.`;
      } else {
        systemPrompt = `You are a financial literacy coach. The user has asked: "${userQuery}"
        
        Provide practical, actionable financial tips relevant to their question.
        
        Focus on:
        - Simple savings strategies
        - Credit score improvement tips
        - Debt management advice
        - Basic budgeting principles
        
        Explain financial concepts in simple terms. Avoid complex financial jargon.
        Offer small, achievable steps they can take to improve their financial situation.
        
         Respond using clear, simple language without financial jargon.`;
      }
      break;
      
    default:
      systemPrompt = `You are a helpful financial assistant. The user has asked: "${userQuery}"
      
      Respond helpfully to their query about financial matters. If they appear to be asking about loans, guide them toward either:
      - Checking their loan eligibility
      - Understanding the loan application process
      - Getting financial literacy tips
      
      If they mention being a student, provide information relevant to student finances and student loans.
      
      Ask clarifying questions if needed.
      
       Respond using clear, simple language without financial jargon.`;
    }
    
    // Convert conversation history to the format expected by Gemini
    const formattedHistory = [];
    
    // Add previous conversation turns if available
    if (Array.isArray(conversationHistory)) {
      for (let i = 0; i < conversationHistory.length; i++) {
        const msg = conversationHistory[i];
        if (msg && msg.content) {
          const role = msg.role === "user" ? "user" : "model";
          formattedHistory.push({
            role: role,
            parts: [{ text: msg.content }]
          });
        }
      }
    }
    
    // Create a chat session with the system prompt
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    });
    
    // Add system prompt and get response
    const result = await chat.sendMessage("As a loan advisor assistant, here's your configuration: " + systemPrompt);
    
    if (!result.response || !result.response.text) {
      throw new Error("Empty or invalid response from Gemini API");
    }
    
    return result.response.text();
  } catch (error) {
    console.error("Error generating response with Gemini:", error);
    
    // If there's an error with the conversation format, try a simpler approach without history
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const simplePrompt = `${systemPrompt}\n\nUser query: ${userQuery}\n\nProvide a helpful response in ${language}.`;
      const result = await model.generateContent(simplePrompt);
      return result.response.text();
    } catch (fallbackError) {
      console.error("Fallback generation also failed:", fallbackError);
      return "I'm having trouble processing your request right now. Please try again later.";
    }
  }
}