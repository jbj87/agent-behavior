export const createSpecPrompt = (requirements: string) => `
You are an expert AI agent architect. Transform these business requirements into a production-ready Agent Behavior Specification.

Use this exact framework:

# AGENT BEHAVIOR SPECIFICATION

## CORE CAPABILITIES
List 3-5 must-have behaviors this agent needs.

## QUALITY BOUNDARIES
- Accuracy floor: [e.g., "95% intent recognition for top 10 use cases"]
- Latency ceiling: [e.g., "Response starts within 800ms"]
- Personality constraints: [e.g., "Professional, concise, never uses jargon"]

## ERROR HANDLING BEHAVIOR
- When uncertain (confidence <70%): [what to do]
- When misunderstands: [how to recover]
- When fails completely: [escalation path]

## LEARNING BOUNDARIES
- What it should adapt to: [user preferences, patterns]
- What it should NOT adapt to: [policies, compliance, safety]
- Feedback signals: [what data indicates improvement needed]

## EDGE CASE HANDLING
- Known failure modes: [list with desired behavior]
- Unacceptable outputs: [hard constraints]
- Escalation triggers: [when to route to human]

## SUCCESS METRICS
- User-facing: [task completion rate, satisfaction]
- System-facing: [response quality, latency, error rate]
- Business: [automation rate, cost per interaction]

REQUIREMENTS TO ANALYZE:
${requirements}

Generate a complete, specific specification following this framework. Be detailed and actionable for engineering teams.
`;
