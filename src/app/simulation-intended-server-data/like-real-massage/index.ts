import msg01HrPayroll from "./msg-01-hr-payroll.json";
import msg02JohnProposal from "./msg-02-john-proposal.json";
import msg03FinanceInvoice from "./msg-03-finance-invoice.json";
import msg04GithubPr from "./msg-04-github-pr.json";
import msg05CalendarSync from "./msg-05-calendar-sync.json";
import payrollPayslipMay2026 from "./payroll-payslip-may-2026.json";

export const EXPECTED_REAL_MESSAGES = [
  msg01HrPayroll,
  msg02JohnProposal,
  msg03FinanceInvoice,
  msg04GithubPr,
  msg05CalendarSync,
] as const;

export {
  msg01HrPayroll,
  msg02JohnProposal,
  msg03FinanceInvoice,
  msg04GithubPr,
  msg05CalendarSync,
  payrollPayslipMay2026,
};
