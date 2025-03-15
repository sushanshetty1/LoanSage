import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY || !process.env.SARVAM_API_KEY) {
      return NextResponse.json({ error: "API keys not configured" }, { status: 500 });
    }

    const { prompt, language = "English" } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Step 1: Use Sarvam Text Analytics to analyze user intent
    const intentData = await analyzeUserIntent(prompt);
    
    // Step 2: Generate appropriate response using Gemini based on the detected intent
    const response = await generateLoanResponse(prompt, intentData, language);
    
    return NextResponse.json({ 
      output: response,
      detectedIntent: intentData.intent,
      confidenceScore: intentData.confidence
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to process financial information request" 
    }, { status: 500 });
  }
}

// Function to analyze user intent using Sarvam Text Analytics API
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
    
    return {
      intent: intentAnswer?.response || "general_inquiry",
      loanType: loanTypeAnswer?.response || "not_specified",
      financialDetails: financialDetailsAnswer?.response || "",
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
  
  // Simple keyword matching
  if (/eligib|qualify|approval|can\s+i\s+get|chances|how\s+much\s+can\s+i\s+borrow/i.test(lowercaseText)) {
    return {
      intent: "loan_eligibility_check",
      loanType: detectLoanType(lowercaseText),
      financialDetails: "",
      confidence: 0.6,
      reasoning: "Detected eligibility-related keywords in query"
    };
  } 
  else if (/apply|application|documents|process|steps|how\s+to\s+get|paperwork/i.test(lowercaseText)) {
    return {
      intent: "loan_application_guidance",
      loanType: detectLoanType(lowercaseText),
      financialDetails: "",
      confidence: 0.6,
      reasoning: "Detected application-related keywords in query"
    };
  }
  else if (/tips|improve|credit\s+score|financial\s+advice|savings|budget|manage/i.test(lowercaseText)) {
    return {
      intent: "financial_literacy_tips",
      loanType: "not_specified",
      financialDetails: "",
      confidence: 0.6,
      reasoning: "Detected financial literacy-related keywords in query"
    };
  }
  
  return {
    intent: "general_inquiry",
    loanType: detectLoanType(lowercaseText),
    financialDetails: "",
    confidence: 0.4,
    reasoning: "No specific intent detected"
  };
}

// Helper function to detect loan type from text
function detectLoanType(text) {
  if (/home|mortgage|property|house/i.test(text)) return "home_loan";
  if (/car|auto|vehicle/i.test(text)) return "auto_loan";
  if (/education|student|college|university|school/i.test(text)) return "education_loan";
  if (/business|startup|company|enterprise/i.test(text)) return "business_loan";
  if (/personal|individual/i.test(text)) return "personal_loan";
  if (/credit\s+card/i.test(text)) return "credit_card";
  return "not_specified";
}

// Function to generate response using Gemini based on detected intent
async function generateLoanResponse(userQuery, intentData, language) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Create a system prompt based on the detected intent
  let systemPrompt;
  
  switch (intentData.intent) {
    case "loan_eligibility_check":
      systemPrompt = `You are a helpful loan eligibility advisor. The user has asked: "${userQuery}"
      
      Our analysis shows they're interested in checking eligibility for a ${intentData.loanType === "not_specified" ? "loan" : intentData.loanType.replace("_", " ")}.
      
      Financial details detected: ${intentData.financialDetails || "None provided"}
      
      Respond as a friendly loan advisor. If they haven't provided enough information about their income, credit score, employment status, or existing debts, ask follow-up questions.
      
      Explain what factors are important for loan eligibility and provide guidance on improving chances of approval.
      
      Respond in ${language} using clear, simple language without financial jargon.`;
      break;
      
    case "loan_application_guidance":
      systemPrompt = `You are a loan application process guide. The user has asked: "${userQuery}"
      
      Our analysis shows they're interested in the application process for a ${intentData.loanType === "not_specified" ? "loan" : intentData.loanType.replace("_", " ")}.
      
      Respond as a helpful loan advisor explaining the step-by-step application process.
      Include:
      1. Required documents
      2. Information they'll need to provide
      3. Typical timeframes for approval
      4. Tips to make the application process smoother
      
      Respond in ${language} using clear, simple language without financial jargon.`;
      break;
      
    case "financial_literacy_tips":
      systemPrompt = `You are a financial literacy coach. The user has asked: "${userQuery}"
      
      Provide practical, actionable financial tips relevant to their question.
      
      Focus on:
      - Simple savings strategies
      - Credit score improvement tips
      - Debt management advice
      - Basic budgeting principles
      
      Explain financial concepts in simple terms. Avoid complex financial jargon.
      Offer small, achievable steps they can take to improve their financial situation.
      
      Respond in ${language} using clear, simple language.`;
      break;
      
    default:
      systemPrompt = `You are a helpful financial assistant. The user has asked: "${userQuery}"
      
      Respond helpfully to their query about financial matters. If they appear to be asking about loans, guide them toward either:
      - Checking their loan eligibility
      - Understanding the loan application process
      - Getting financial literacy tips
      
      Ask clarifying questions if needed.
      
      Respond in ${language} using clear, simple language without financial jargon.`;
  }

  const generationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 800,
  };

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error generating response with Gemini:", error);
    return "I'm having trouble processing your request right now. Please try again.";
  }
}