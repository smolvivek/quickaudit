# QuickAudit Backend Architecture Plan

## Overview
This document outlines the backend architecture for the QuickAudit application, designed to support all features required for a comprehensive audit management system across multiple platforms (iOS, Android, and Web).

## Technology Stack
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB (NoSQL) for flexibility and scalability
- **Authentication**: JWT (JSON Web Tokens) with refresh token mechanism
- **API Design**: RESTful API with versioning
- **Cloud Hosting**: AWS or similar cloud provider
- **File Storage**: AWS S3 for media storage (photos, documents)
- **Offline Sync**: Custom sync mechanism with conflict resolution
- **Real-time Updates**: WebSockets for live notifications

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "String (unique)",
  "passwordHash": "String",
  "salt": "String",
  "firstName": "String",
  "lastName": "String",
  "role": "String (field_auditor, supervisor, admin, client)",
  "organization": "ObjectId (ref: Organizations)",
  "status": "String (active, inactive)",
  "lastLogin": "Date",
  "createdAt": "Date",
  "updatedAt": "Date",
  "profileImage": "String (URL)",
  "deviceTokens": ["String"],
  "settings": {
    "notifications": "Boolean",
    "language": "String",
    "theme": "String"
  }
}
```

### Organizations Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "address": "String",
  "contactEmail": "String",
  "contactPhone": "String",
  "logo": "String (URL)",
  "subscription": {
    "plan": "String",
    "startDate": "Date",
    "endDate": "Date",
    "status": "String (active, expired, trial)"
  },
  "settings": {
    "branding": {
      "primaryColor": "String",
      "secondaryColor": "String"
    },
    "features": {
      "offlineMode": "Boolean",
      "customForms": "Boolean",
      "analytics": "Boolean"
    }
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Audit Templates Collection
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "organization": "ObjectId (ref: Organizations)",
  "creator": "ObjectId (ref: Users)",
  "category": "String",
  "sections": [
    {
      "title": "String",
      "description": "String",
      "items": [
        {
          "text": "String",
          "type": "String (checkbox, text, number, photo)",
          "required": "Boolean",
          "options": ["String"] // For multiple choice items
        }
      ]
    }
  ],
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastUsed": "Date"
}
```

### Audits Collection
```json
{
  "_id": "ObjectId",
  "title": "String",
  "template": "ObjectId (ref: AuditTemplates)",
  "organization": "ObjectId (ref: Organizations)",
  "location": "String",
  "auditor": "ObjectId (ref: Users)",
  "supervisor": "ObjectId (ref: Users)",
  "status": "String (draft, in_progress, pending_review, completed, archived)",
  "score": "Number",
  "startTime": "Date",
  "endTime": "Date",
  "sections": [
    {
      "title": "String",
      "score": "Number",
      "items": [
        {
          "text": "String",
          "response": "String (compliant, non-compliant, na)",
          "notes": "String",
          "photos": ["String (URL)"],
          "timestamp": "Date"
        }
      ]
    }
  ],
  "findings": [
    {
      "title": "String",
      "description": "String",
      "severity": "String (high, medium, low)",
      "category": "String",
      "photos": ["String (URL)"]
    }
  ],
  "actions": [
    {
      "title": "String",
      "description": "String",
      "assignee": "ObjectId (ref: Users)",
      "dueDate": "Date",
      "status": "String (open, in_progress, completed)",
      "progress": "Number",
      "completedDate": "Date"
    }
  ],
  "notes": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "syncStatus": "String (synced, pending_sync, conflict)",
  "syncId": "String (unique identifier for offline sync)"
}
```

### Notifications Collection
```json
{
  "_id": "ObjectId",
  "recipient": "ObjectId (ref: Users)",
  "sender": "ObjectId (ref: Users)",
  "type": "String (audit_assigned, audit_completed, action_assigned, etc.)",
  "title": "String",
  "message": "String",
  "relatedEntity": {
    "type": "String (audit, action, etc.)",
    "id": "ObjectId"
  },
  "isRead": "Boolean",
  "createdAt": "Date"
}
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin only)
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update current user profile

### Organizations
- `GET /api/v1/organizations` - Get all organizations (admin only)
- `POST /api/v1/organizations` - Create organization (admin only)
- `GET /api/v1/organizations/:id` - Get organization by ID
- `PUT /api/v1/organizations/:id` - Update organization
- `DELETE /api/v1/organizations/:id` - Delete organization (admin only)

### Audit Templates
- `GET /api/v1/templates` - Get all templates for organization
- `POST /api/v1/templates` - Create template
- `GET /api/v1/templates/:id` - Get template by ID
- `PUT /api/v1/templates/:id` - Update template
- `DELETE /api/v1/templates/:id` - Delete template
- `GET /api/v1/templates/categories` - Get all template categories

### Audits
- `GET /api/v1/audits` - Get all audits for organization
- `POST /api/v1/audits` - Create audit
- `GET /api/v1/audits/:id` - Get audit by ID
- `PUT /api/v1/audits/:id` - Update audit
- `DELETE /api/v1/audits/:id` - Delete audit
- `PUT /api/v1/audits/:id/status` - Update audit status
- `POST /api/v1/audits/:id/submit` - Submit audit for review
- `POST /api/v1/audits/:id/approve` - Approve audit (supervisor only)
- `POST /api/v1/audits/:id/reject` - Reject audit (supervisor only)
- `GET /api/v1/audits/:id/pdf` - Generate PDF report

### Actions
- `GET /api/v1/actions` - Get all actions for organization
- `GET /api/v1/actions/:id` - Get action by ID
- `PUT /api/v1/actions/:id` - Update action
- `PUT /api/v1/actions/:id/status` - Update action status
- `PUT /api/v1/actions/:id/progress` - Update action progress

### Notifications
- `GET /api/v1/notifications` - Get all notifications for current user
- `PUT /api/v1/notifications/:id/read` - Mark notification as read
- `PUT /api/v1/notifications/read-all` - Mark all notifications as read

### Sync
- `POST /api/v1/sync` - Sync offline data
- `GET /api/v1/sync/status` - Get sync status

### Files
- `POST /api/v1/files/upload` - Upload file
- `GET /api/v1/files/:id` - Get file by ID
- `DELETE /api/v1/files/:id` - Delete file

## Security Considerations
- All API endpoints will be secured with JWT authentication
- Role-based access control for all endpoints
- Input validation and sanitization
- Rate limiting to prevent abuse
- HTTPS for all communications
- Secure password storage with bcrypt
- Regular security audits and penetration testing

## Offline Functionality
- Local database using SQLite or Realm
- Sync queue for pending changes
- Conflict resolution strategy
- Background sync when connectivity is restored
- Prioritized sync for critical data

## Performance Considerations
- Database indexing for frequently queried fields
- Pagination for large result sets
- Caching for frequently accessed data
- Optimized queries to minimize database load
- Compression for network requests
- Lazy loading for images and large content

## Scalability
- Horizontal scaling with load balancing
- Database sharding for large organizations
- Microservices architecture for independent scaling
- CDN for static assets and media
- Caching layer with Redis

## Monitoring and Logging
- Centralized logging system
- Performance monitoring
- Error tracking and alerting
- User activity auditing
- System health checks

## Deployment Strategy
- CI/CD pipeline for automated testing and deployment
- Staging environment for pre-production testing
- Blue-green deployment for zero-downtime updates
- Automated backups and disaster recovery
- Infrastructure as code for reproducible environments
