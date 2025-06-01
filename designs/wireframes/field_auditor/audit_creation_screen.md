# Field Auditor - Audit Creation Screen

## Screen Description
This screen allows field auditors to start a new audit by selecting templates and configuring basic audit parameters. It features an intuitive step-by-step process with clear visual guidance.

## UI Elements

### Header
- "New Audit" title with back button
- Progress indicator showing current step
- Save as draft button

### Template Selection Section
- Search bar for finding templates
- Filter options (Recent, Favorites, Categories)
- Grid/List toggle view
- Template cards showing:
  - Template name
  - Category/type icon
  - Last used date
  - Favorite toggle
  - Preview thumbnail

### Audit Configuration
- Audit name field (auto-populated but editable)
- Location selection with map integration
- Date and time picker
- Priority selector (Low, Medium, High)
- Assignee field (defaults to self)
- Notes/Description field
- Attachments section for pre-audit documentation

### Action Buttons
- "Start Now" primary button
- "Schedule for Later" secondary button
- "Cancel" text button

### Bottom Navigation
- Dashboard
- Audits (active)
- Templates
- Reports
- More

## Behavior
- Templates can be filtered and searched in real-time
- Location can be entered manually or detected via GPS
- Offline templates are clearly marked and available without connection
- Form validation ensures all required fields are completed
- Draft saving happens automatically at regular intervals

## Color Scheme
- Background: Light gray (#F8FAFC)
- Cards: White (#FFFFFF)
- Primary actions: Primary Blue (#2563EB)
- Secondary actions: Outlined style with Primary Blue text
- Template categories: Color-coded for quick identification

## Accessibility Considerations
- All form fields have clear labels
- Error states provide specific guidance
- Keyboard navigation is fully supported
- Color is not the only means of conveying information

## Platform-Specific Adaptations
- iOS: Native date/time pickers
- Android: Material Design components
- Web: Expanded layout with sidebar navigation
