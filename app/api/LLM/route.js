import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // Check if API keys are configured
    if (!process.env.GEMINI_API_KEY || !process.env.SARVAM_API_KEY) {
      return NextResponse.json(
        { error: "API keys not configured" },
        { status: 500 }
      );
    }

    // Parse the request body
    const { prompt, language = "en-IN", conversationHistory = [], userPreferences } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    let translatedPrompt = prompt;

    // Step 1: Translate the prompt to English if necessary
    if (language !== "en-IN" && language !== "English") {
      try {
        translatedPrompt = await translateText(prompt, language, "en-IN");
        console.log("Translated prompt:", translatedPrompt);
      } catch (error) {
        console.error("Translation error:", error);
        // Continue with the original prompt if translation fails
      }
    }

    // Step 2: Analyze user intent using Sarvam AI
    const intentData = await analyzeUserIntent(translatedPrompt);

    // Step 3: Generate a response based on the detected intent
    let responseText;
    if (intentData.intent === "loan_recommendation") {
      // Check if loans are available based on user preferences
      const loans = await fetchLoansFromDatabase(userPreferences);
      if (loans.length === 0) {
        // No loans found, suggest creating a loan request
        responseText = "No suitable loans found. Would you like to submit a loan request? Please provide the purpose of the loan.";
      } else {
        // Generate loan recommendations
        responseText = await generateLoanRecommendations(loans, translatedPrompt, intentData);
      }
    } else {
      // Handle other intents (e.g., eligibility check, application guidance)
      responseText = await generateGenericResponse(translatedPrompt, intentData, conversationHistory);
    }

    // Step 4: Translate the response back to the user's language if necessary
    let finalResponse = responseText;
    if (language !== "en-IN" && language !== "English") {
      try {
        finalResponse = await translateText(responseText, "en-IN", language);
        console.log("Translated response:", finalResponse);
      } catch (error) {
        console.error("Translation error:", error);
        // Continue with the English response if translation fails
        finalResponse = responseText;
      }
    }

    // Step 5: Update the conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: prompt },
      { role: "assistant", content: finalResponse }
    ];

    // Return the response
    return NextResponse.json({
      output: finalResponse,
      detectedIntent: intentData.intent,
      confidenceScore: intentData.confidence,
      conversationHistory: updatedHistory
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process financial information request" },
      { status: 500 }
    );
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
          "loan_recommendation",
          "financial_literacy_tips",
          "student_loan_information",
          "higher_education_financing", 
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
  
  if (/higher\s+education|college|university|masters|phd|abroad|scholarship|no\s+money|no\s+financial|financial\s+backup|can't\s+afford|parents\s+can't\s+pay|expensive\s+tuition|graduate\s+school/i.test(lowercaseText)) {
    if (/no\s+money|no\s+financial|financial\s+backup|can't\s+afford|parents\s+can't\s+pay|expensive|no\s+support|scholarship/i.test(lowercaseText)) {
      return {
        intent: "higher_education_financing",
        loanType: "education_loan",
        financialDetails: extractFinancialConstraints(lowercaseText),
        studentDetails: extractStudentDetails(lowercaseText),
        confidence: 0.8,
        reasoning: "Detected higher education financing need with financial constraints"
      };
    } else {
      return {
        intent: "student_loan_information",
        loanType: "education_loan",
        financialDetails: "",
        studentDetails: extractStudentDetails(lowercaseText),
        confidence: 0.7,
        reasoning: "Detected higher education query"
      };
    }
  }

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

async function generateLoanRecommendations(loans, prompt, intentData) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are a loan recommendation expert. Analyze the following loans and provide a summary:
  - Loans: ${JSON.stringify(loans)}
  - User Query: ${prompt}
  - Detected Intent: ${intentData.intent}

  Provide a concise response with the top 3 loan recommendations.`;

  const result = await model.generateContent(systemPrompt);
  return result.response.text();
}

async function fetchLoansFromDatabase(preferences) {
  try {
    // Example query to fetch loans from Firestore
    const loansRef = collection(db, "loans");
    let q = query(loansRef);

    if (preferences?.amount) {
      q = query(q, where("minAmount", "<=", preferences.amount));
      q = query(q, where("maxAmount", ">=", preferences.amount));
    }
    if (preferences?.tenure) {
      q = query(q, where("tenure", "==", preferences.tenure));
    }
    if (preferences?.interestRate) {
      q = query(q, where("interestRate", "<=", preferences.interestRate));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching loans:", error);
    return [];
  }
}

function extractFinancialConstraints(text) {
  let constraints = [];
  
  if (/no\s+money|no\s+financial|no\s+backup|no\s+support/i.test(text)) {
    constraints.push("No financial backup");
  }
  
  if (/can't\s+afford|expensive|high\s+cost|costly/i.test(text)) {
    constraints.push("Affordability concerns");
  }
  
  if (/parents\s+can't\s+pay|family\s+can't\s+support|no\s+family\s+support/i.test(text)) {
    constraints.push("No family financial support");
  }
  
  if (/scholarship|financial\s+aid|grant|funding/i.test(text)) {
    constraints.push("Seeking alternative funding");
  }
  
  if (/working|part-time|job|income/i.test(text)) {
    constraints.push("May have part-time income");
  }
  
  return constraints.join(', ');
}

async function generateGenericResponse(prompt, intentData, conversationHistory) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are a financial assistant. Respond to the user's query:
  - User Query: ${prompt}
  - Detected Intent: ${intentData.intent}

  Provide a helpful and concise response.`;

  const result = await model.generateContent(systemPrompt);
  return result.response.text();
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

    if(intentData.intent === "loan_recommendation") {
      return await handleLoanRecommendation(userQuery, intentData, conversationHistory);
    }

    let systemPrompt;
    
    switch (intentData.intent) {
      case "higher_education_financing":
        systemPrompt = `You are a higher education financial planning specialist. The user has asked: "${userQuery}"
        
        Our analysis shows they're interested in financing their higher education but have financial constraints:
        
        Student details detected: ${intentData.studentDetails || "None provided"}
        Financial constraints detected: ${intentData.financialDetails || "No financial backup"}
        
        Provide comprehensive guidance on financing higher education with limited financial resources, including:
        
        1. COMPREHENSIVE FUNDING STRATEGY:
           - Explain different funding sources (loans, scholarships, grants, work-study)
           - How to create a balanced funding portfolio to minimize debt
           - Government vs private education loans comparison
           
        2. SCHOLARSHIP OPPORTUNITIES:
           - Types of scholarships (merit, need-based, diversity, field-specific)
           - Tips for successful scholarship applications
           - Resources for finding lesser-known scholarships
           
        3. FINANCIAL AID GUIDANCE:
           - FAFSA/financial aid application process
           - Need-based aid programs
           - Understanding aid award letters
           
        4. PART-TIME WORK OPTIONS:
           - On-campus employment opportunities
           - Balancing work and studies
           - Remote/flexible earning opportunities for students
           
        5. BUDGETING FOR STUDENTS:
           - Creating a realistic student budget
           - Reducing expenses while in school
           - Managing loan disbursements effectively
           
        6. LONG-TERM FINANCIAL PLANNING:
           - Understanding debt-to-income ratio after graduation
           - Loan repayment options and forgiveness programs
           - Building emergency funds while studying
        
        If they haven't provided specific details about their education plans or financial situation, ask clarifying questions to provide more tailored guidance.
        
        Respond with empathy to their financial constraints while maintaining an encouraging tone about the possibilities for funding their education. Use clear, simple language suitable for students.`;
        break;

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

    function extractStudentDetails(text) {
      let details = [];
      
      // Extract education level with more options
      if (/undergraduate|bachelor|graduate|master|phd|doctorate|mba|postgraduate|higher\s+education|further\s+studies/i.test(text)) {
        const matches = text.match(/undergraduate|bachelor|graduate|master|phd|doctorate|mba|postgraduate|higher\s+education|further\s+studies/i);
        if (matches) details.push(`Education level: ${matches[0]}`);
      }
      
      // Extract study location (domestic/international)
      if (/abroad|overseas|foreign|international|different country/i.test(text)) {
        details.push("Location: International study");
      } else if (/domestic|local|within country/i.test(text)) {
        details.push("Location: Domestic study");
      }
      
      // Extract field of study if mentioned
      const fieldRegex = /studying\s+([A-Za-z\s]+)|([A-Za-z\s]+)\s+degree|([A-Za-z\s]+)\s+program|major\s+in\s+([A-Za-z\s]+)/i;
      const fieldMatch = text.match(fieldRegex);
      if (fieldMatch) {
        const field = fieldMatch[1] || fieldMatch[2] || fieldMatch[3] || fieldMatch[4];
        if (field) details.push(`Field: ${field.trim()}`);
      }
      
      // Extract university/college if mentioned
      const uniRegex = /at\s+([A-Za-z\s]+university|[A-Za-z\s]+college|[A-Za-z\s]+institute)/i;
      const uniMatch = text.match(uniRegex);
      if (uniMatch) details.push(`Institution: ${uniMatch[1]}`);
      
      // Extract year/semester if mentioned
      const yearRegex = /(first|second|third|fourth|final)\s+(year|semester)/i;
      const yearMatch = text.match(yearRegex);
      if (yearMatch) details.push(`Year: ${yearMatch[0]}`);
      
      // Extract duration or timeline
      const durationRegex = /(\d+)(\s+|-)(year|month|semester)s?(\s+|-)(program|course|degree)/i;
      const durationMatch = text.match(durationRegex);
      if (durationMatch) details.push(`Duration: ${durationMatch[0]}`);
      
      return details.join(', ');
    }
    
    async function handleLoanRecommendation(userQuery, intentData, conversationHistory) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are a loan recommendation expert. Follow these steps:
        1. Ask user for required details (loan amount, tenure, preferred interest rate)
        2. Collect responses in JSON format
        3. Analyze loan options from database
        4. Present top 3 options with key features
        5. Keep responses conversational and friendly`;

        const chat = model.startChat({
          history: formatConversationHistory(conversationHistory),
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 800
          }
        });

        const result = await chat.sendMessage(systemPrompt + "\n\nUser query: " + userQuery);
        return result.response.text();
      }

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