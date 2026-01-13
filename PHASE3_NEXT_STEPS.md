# Phase 3 - Next Steps: Frontend Enterprise Profile UI

## Current Status

✅ **Backend Complete (100%)**
- All enterprise profile endpoints implemented
- File upload endpoints working
- External API integrations ready (INSEE, Google Places, MinIO)
- Swagger documentation available

⏳ **Frontend Pending (0%)**
- Enterprise profile UI not yet built
- Need to connect frontend to backend APIs

---

## Recommended Next Steps

### Option 1: Build Enterprise Profile Frontend UI (Recommended)

**Priority**: High  
**Estimated Time**: 1-2 weeks  
**Team**: 1-2 frontend developers

#### Tasks:

1. **Dashboard Layout & Navigation** (2-3 days)
   - Create dashboard layout with sidebar
   - Add enterprise profile navigation tabs
   - Set up routing structure
   - Add tenant switcher placeholder (for Phase 5)

2. **Basic Info Tab** (2-3 days)
   - Display current enterprise info
   - Edit form with validation
   - SIRET/KBIS validation integration
   - Activity domain & speciality dropdowns
   - Real-time validation feedback

3. **Address Tab** (1-2 days)
   - Display current address
   - Google Places autocomplete input
   - Address form
   - Creation date display

4. **Marketing Tab** (2-3 days)
   - Logo upload component
   - Cover image upload component
   - Image preview
   - Image deletion
   - File validation UI

5. **Documents Tab** (2-3 days)
   - Documents list/table
   - Document upload component
   - Category selection
   - Document download
   - Document deletion

6. **Subscription Tab** (2-3 days)
   - Current plan display
   - Plan features comparison
   - Upgrade/downgrade buttons (placeholder for Phase 4)
   - Payment methods list (placeholder for Phase 4)
   - Invoices list (placeholder for Phase 4)

---

### Option 2: Test Backend APIs First

**Priority**: Medium  
**Estimated Time**: 1-2 days  
**Team**: 1 backend developer

#### Tasks:

1. **API Testing**
   - Test all enterprise endpoints with Postman/Thunder Client
   - Test file uploads (logo, cover, documents)
   - Test INSEE API integration
   - Test Google Places integration
   - Verify error handling

2. **Integration Testing**
   - Test with real MinIO instance
   - Test with real INSEE API (if available)
   - Test with real Google Places API
   - Verify file storage and retrieval

---

### Option 3: Continue with Subscription Backend (Phase 4)

**Priority**: Low (can be done in parallel)  
**Estimated Time**: 1-2 weeks  
**Team**: 1-2 backend developers

#### Tasks:

1. **Stripe Integration**
   - Set up Stripe SDK
   - Payment method management
   - Subscription creation/management
   - Webhook handlers

2. **Subscription Endpoints**
   - Subscription CRUD
   - Payment method endpoints
   - Invoice endpoints
   - Plan upgrade/downgrade

---

## Recommendation

**Start with Option 1: Build Enterprise Profile Frontend UI**

### Why?
1. **User Value**: Users can immediately start using the enterprise profile features
2. **Natural Progression**: Frontend is the next logical step after backend completion
3. **Testing**: Building the UI will naturally test the backend APIs
4. **Momentum**: Keeps the development flow going

### Implementation Order:

1. **Week 1: Foundation & Basic Info**
   - Dashboard layout
   - Basic Info tab
   - API integration

2. **Week 2: Address, Marketing & Documents**
   - Address tab
   - Marketing tab (file uploads)
   - Documents tab

3. **Week 3: Subscription Tab & Polish**
   - Subscription tab (basic view, placeholders for Phase 4)
   - UI/UX polish
   - Error handling
   - Loading states

---

## Quick Start Guide

### 1. Create Enterprise Profile Service

```typescript
// apps/ila26/src/services/enterprise-service.ts
import apiClient from '@/src/lib/api-client';

export const enterpriseService = {
  getProfile: () => apiClient.get('/enterprise/profile'),
  updateProfile: (data) => apiClient.put('/enterprise/profile', data),
  validateSiret: (siret) => apiClient.post('/enterprise/validate-siret', { siret }),
  // ... etc
};
```

### 2. Create Dashboard Layout

```typescript
// apps/ila26/app/dashboard/layout.tsx
// Sidebar navigation with tabs
```

### 3. Create Profile Tabs

```typescript
// apps/ila26/app/dashboard/enterprise/basic-info/page.tsx
// apps/ila26/app/dashboard/enterprise/address/page.tsx
// apps/ila26/app/dashboard/enterprise/marketing/page.tsx
// etc.
```

---

## Dependencies Needed

### Frontend Packages (if not already installed):
- `react-dropzone` - For file uploads
- `@tanstack/react-query` - For API state management (optional, can use Zustand)
- `react-select` - For dropdowns (or use Shadcn/ui Select)

---

## Success Criteria

Phase 3 Frontend is complete when:
- ✅ All enterprise profile tabs are functional
- ✅ Forms submit to backend APIs
- ✅ File uploads work (logo, cover, documents)
- ✅ SIRET/KBIS validation works
- ✅ Address autocomplete works
- ✅ UI is responsive and polished
- ✅ Error handling is in place
- ✅ Loading states are implemented

---

**Ready to start building the frontend?** 🚀

