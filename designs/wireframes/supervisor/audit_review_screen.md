# Supervisor - Audit Review Screen

## Screen Description
The Audit Review screen enables supervisors to thoroughly examine completed audits, provide feedback, and make approval decisions. It presents a comprehensive view of audit findings with tools for detailed analysis and quality control.

## UI Elements

### Header
- "Audit Review" title with audit name
- Audit ID and submission date
- Auditor name with profile link
- Status badge (Pending Review, Approved, Rejected)
- Action buttons (Approve, Request Changes, Reject)

### Audit Overview Card
- Compliance score with visual gauge
- Comparison to department/location average
- Critical findings count
- Completion time
- Location details with map thumbnail
- Template information

### Section Navigator
- Collapsible list of audit sections
- Completion status for each section
- Score breakdown by section
- Quick jump to sections
- Flagged items indicators

### Finding Details
- Filterable list of all findings
- Severity indicators
- Compliance status (Compliant, Non-Compliant, N/A)
- Evidence thumbnails with full-screen preview
- Auditor notes
- Historical comparison (if available)

### Corrective Actions Panel
- List of assigned corrective actions
- Assignment details
- Due dates
- Priority levels
- Status tracking
- Add/edit action capabilities

### Feedback Section
- Comment thread between supervisor and auditor
- @mention capability
- Attachment support
- Section-specific comments
- Private notes option

### Navigation Sidebar
- Dashboard
- Team Management
- Audit Reviews (active)
- Reports & Analytics
- Action Items
- Schedule
- Settings

## Behavior
- Side-by-side comparison with previous audits
- Annotation tools for highlighting issues
- Approval workflow with optional escalation
- Email notifications for feedback
- Audit history tracking

## Color Scheme
- Background: Light gray (#F8FAFC)
- Content areas: White (#FFFFFF)
- Compliance indicators: Success green (#10B981), Error red (#EF4444), Warning yellow (#FBBF24)
- Severity levels: Color-coded from yellow to red
- Action buttons: Approve (green), Request Changes (yellow), Reject (red)

## Accessibility Considerations
- All images have descriptive alt text
- Review comments are properly structured for screen readers
- Keyboard navigation for all interactive elements
- Focus management for modal dialogs

## Platform-Specific Adaptations
- Mobile: Simplified view focusing on findings and approval
- Tablet: Two-column layout with section navigation
- Desktop: Multi-pane layout with expanded details
