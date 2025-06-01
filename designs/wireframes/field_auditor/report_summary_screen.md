# Field Auditor - Report Summary Screen

## Screen Description
This screen provides a comprehensive summary of the completed audit, allowing field auditors to review findings, add final notes, and submit the audit report. It presents a clear overview of compliance status and identified issues.

## UI Elements

### Header
- "Audit Summary" title with back button
- Audit name and ID
- Completion status badge
- Date and time of completion
- Auditor name

### Overall Statistics Card
- Compliance score with visual gauge
- Total items count
- Breakdown of compliant/non-compliant/NA items
- Comparison to previous audit (if applicable)
- Color-coded status indicators

### Section Summary
- Accordion-style expandable sections
- Section scores and compliance percentages
- Critical findings highlighted
- Quick navigation to section details

### Non-Compliance Summary
- Filterable list of non-compliant items
- Severity indicators
- Photo evidence thumbnails
- Assigned corrective actions
- Due dates for remediation

### Evidence Gallery
- Grid view of all photos taken
- Filtering by section/item
- Thumbnail previews
- Full-screen viewing option

### Final Notes
- Overall comments field
- Signature capture area
- Additional attachments option

### Action Buttons
- "Edit Before Submission" secondary button
- "Submit Report" primary button
- "Save as Draft" text link
- "Generate PDF Preview" option

### Bottom Navigation
- Dashboard
- Audits (active)
- Templates
- Reports
- More

## Behavior
- Automatic calculation of scores and statistics
- Offline submission queuing when no connection
- PDF generation available for preview before submission
- Email notification options for stakeholders

## Color Scheme
- Background: Light gray (#F8FAFC)
- Cards: White (#FFFFFF)
- Compliance indicators: Success green (#10B981), Error red (#EF4444), Warning yellow (#FBBF24)
- Primary actions: Primary Blue (#2563EB)

## Accessibility Considerations
- Screen reader support for statistics and summaries
- Keyboard navigation for all interactive elements
- Alternative text for all images and icons
- Focus indicators for interactive elements

## Platform-Specific Adaptations
- iOS: Share sheet for report distribution
- Android: Material Design components with haptic feedback
- Web: Expanded layout with print optimization
