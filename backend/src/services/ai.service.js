const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

const interviewreportJSONSchema = {
    type: "object",
    properties: {
        technicalQuestion: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description: "A technical question that can be asked in the interview"
                    },
                    intention: {
                        type: "string",
                        description: "The intention behind asking this question"
                    },
                    answer: {
                        type: "string",
                        description: "A possible answer to this question"
                    }
                },
                required: ["question", "intention", "answer"]
            }
        },

        behaviorQuestion: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description: "A behavioral question that can be asked in the interview"
                    },
                    intention: {
                        type: "string",
                        description: "The intention behind asking this question"
                    },
                    answer: {
                        type: "string",
                        description: "A possible answer to this question"
                    }
                },
                required: ["question", "intention", "answer"]
            }
        },
        matchscore: {
            type: "number",
            description: "A match score between 0 and 100 indicating candidate fit for the job description"
        },
        title:{
            type:"string",
            description:"Add job title for whicch the user is applying"
        },
        summary:{
            type:"string",
            description:"Add a 2 line summary for that particular job role"
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skills: {
                        type: "string",
                        description: "A skill that is missing or weak in the resume"
                    },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "How critical this skill gap is"
                    },
                    note:{
                        type:"string",
                        description:"Gives a short note on the skill gap"
                    }
                },
                required: ["skills", "severity","note"]
            }
        },
        matchedSkills:{
            type:"array",
            items:{
                type:"object",
                properties:{
                    name:{
                        type:"string",
                        description:"A skill that is matched"
                    },
                    note:{
                        type:"string",
                        description:"A note on skill that is matched"
                    }
                },
                 required: ["name","note"]
            }
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    days: {
                        type: "number",
                        description: "Number of days allocated for this phase"
                    },
                    focus: {
                        type: "string",
                        description: "The main focus area for this phase"
                    },
                    tasks: {
                        type: "array",
                        items: {
                            type: "string",
                            description: "A specific task to complete in this phase"
                        }
                    }
                },
                required: ["days", "focus", "tasks"]
            }
        }
    },
    required: ["matchscore", "technicalQuestion", "behaviorQuestion", "skillGaps", "preparationPlan","title","summary"]
};

async function InterviewReport({ resume, jobdescription, selfdescription }) {
    const prompt = `You are an expert technical recruiter and interview coach. You will receive a candidate's resume, a job description (JD), and the candidate's self description. Analyse how well the candidate fits the role and help them prepare.

## Resume:
${resume}

## Job Description:
${jobdescription}

## Candidate's Self Description:
${selfdescription}

Rules:
1. Base every claim only on the text provided. Never invent skills, employers, projects, or numbers. If something is not in the resume or self description, treat it as missing.
2. Match score (0-100) must reflect: required skills covered (about 50%), relevant experience level and domain (about 30%), nice-to-have skills and self description fit (about 20%). Be honest and calibrated: 90+ is rare, and missing several required skills should land below 60.
3. "matched" lists JD skills the candidate clearly shows evidence for. In each note, point to the evidence (project, role, or self description).
4. "gaps" lists JD skills that are missing or weak. Use level "high" for required skills and "med" for nice-to-have or partial skills. In each note, say why it matters for this JD and what would close it.
5. Technical questions must be specific to the JD's stack and responsibilities, mixing fundamentals with scenario-based questions. Each "a" explains what a strong answer should cover, not a full essay.
6. Behavioural questions must be tied to the role's seniority and to the candidate's actual background where possible. Each "a" should suggest which of the candidate's real experiences to use and how to structure it (STAR).
7. The preparation plan must target the gaps first, with concrete, checkable tasks, and be realistic for the time available (default: 3 weeks).
8. Use plain, direct language. No filler or praise.`

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewreportJSONSchema,
        }
    });

    const interview = JSON.parse(response.text);
    return interview;  
}

module.exports = InterviewReport; 