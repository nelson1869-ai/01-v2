import type { ApprovalRequest } from "../contracts";

export const INITIAL_APPROVAL_REQUESTS: readonly ApprovalRequest[] = [
  {
    id: "appr_001",
    action: "gmail.send_email",
    tool: "Gmail API",
    argumentsPreview:
      '{"to": "john@partner.com", "subject": "Proposal Confirmation", "body": "Thank you for the update..."}',
    reason: "User scheduled follow-up email response to John Doe's proposal.",
    risk: "HIGH",
    evidence: "Proposal email thread verified #msg_02_john",
    requestedCapability: "cap_gmail_send",
    policyResult: "REQUIRE_APPROVAL",
    expectedEffect: "Dispatches external email to recipient mailbox",
    potentialSideEffect: "Cannot be un-sent once delivered",
    status: "PENDING",
  },
  {
    id: "appr_002",
    action: "calendar.create_event",
    tool: "Google Calendar",
    argumentsPreview:
      '{"summary": "Project Kickoff", "start": "2026-05-28T15:00:00Z", "attendees": ["john@partner.com"]}',
    reason: "AutoDo identified meeting request in email thread #msg_05_meet.",
    risk: "MEDIUM",
    evidence: "Email thread contains explicit request for Thursday 3 PM",
    requestedCapability: "cap_cal_create",
    policyResult: "REQUIRE_APPROVAL",
    expectedEffect: "Creates event on primary calendar and sends invites",
    potentialSideEffect: "Calendar invite sent to external attendee",
    status: "PENDING",
  },
];
