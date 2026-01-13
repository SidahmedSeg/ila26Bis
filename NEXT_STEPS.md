# Next Steps - Implementation Roadmap

## ✅ Completed Phases

### Phase 0: Project Setup & Foundation
- ✅ Monorepo structure
- ✅ Docker infrastructure (PostgreSQL, Redis, MinIO)
- ✅ Shared Prisma schema
- ✅ Development environment

### Phase 1: Core Backend Infrastructure (90% Complete)
- ✅ User API & Admin API initialized
- ✅ Authentication systems (OTP, Registration, Login)
- ✅ JWT guards and decorators
- ✅ Mailtrap integration
- ✅ Error handling middleware
- ✅ Swagger documentation
- ⏳ External API integrations (Stripe, INSEE, Google) - Pending

### Phase 2: Frontend Authentication (100% Complete)
- ✅ Next.js projects initialized (both apps)
- ✅ Shadcn/ui configured
- ✅ Login pages (both apps)
- ✅ Registration flow (3 pages: email, OTP, form)
- ✅ Protected routes middleware
- ✅ Dashboard pages
- ✅ Zustand stores for auth state

---

## 🎯 Next Phase: Phase 3 - Enterprise Profile Management

### Overview
Build the enterprise profile management system for the ila26 app, including all tabs and features.

### Estimated Duration: 2-3 weeks

---

## Phase 3 Tasks Breakdown

### 1. Backend APIs - Enterprise Profile (Week 1)

#### Enterprise Basic Info
- [ ] GET `/api/enterprise/profile` - Get current tenant profile
- [ ] PUT `/api/enterprise/profile` - Update basic info
- [ ] POST `/api/enterprise/validate-siret` - Validate SIRET via INSEE API
- [ ] POST `/api/enterprise/validate-kbis` - Validate KBIS via INSEE API
- [ ] GET `/api/enterprise/activities` - Get activity domains (from admin)
- [ ] GET `/api/enterprise/specialities` - Get specialities by activity

#### Enterprise Address
- [ ] PUT `/api/enterprise/address` - Update address
- [ ] POST `/api/enterprise/address/autocomplete` - Google Places autocomplete

#### Enterprise Marketing
- [ ] POST `/api/enterprise/logo` - Upload logo (MinIO)
- [ ] POST `/api/enterprise/cover` - Upload cover image (MinIO)
- [ ] DELETE `/api/enterprise/logo` - Delete logo
- [ ] DELETE `/api/enterprise/cover` - Delete cover image

#### Enterprise Documents
- [ ] GET `/api/enterprise/documents` - List documents
- [ ] POST `/api/enterprise/documents` - Upload document (MinIO)
- [ ] DELETE `/api/enterprise/documents/:id` - Delete document
- [ ] GET `/api/enterprise/documents/categories` - Get document categories

#### Enterprise Subscription
- [ ] GET `/api/enterprise/subscription` - Get current subscription
- [ ] GET `/api/enterprise/subscription/invoices` - List invoices
- [ ] GET `/api/enterprise/subscription/payment-methods` - List payment methods
- [ ] POST `/api/enterprise/subscription/payment-methods` - Add payment method (Stripe)
- [ ] DELETE `/api/enterprise/subscription/payment-methods/:id` - Remove payment method
- [ ] POST `/api/enterprise/subscription/upgrade` - Upgrade subscription
- [ ] POST `/api/enterprise/subscription/downgrade` - Downgrade subscription

### 2. External API Integrations (Week 1)

#### INSEE API Client
- [ ] Create INSEE API service
- [ ] SIRET validation endpoint
- [ ] KBIS validation endpoint
- [ ] Company info retrieval
- [ ] Error handling

#### Google Places API Client
- [ ] Create Google Places service
- [ ] Address autocomplete endpoint
- [ ] Place details retrieval
- [ ] Error handling

#### MinIO Integration
- [ ] MinIO client setup
- [ ] File upload service
- [ ] File download service
- [ ] File deletion service
- [ ] Bucket configuration (logos, covers, documents)

#### Stripe Integration (Basic)
- [ ] Stripe client setup
- [ ] Payment method creation
- [ ] Payment method listing
- [ ] Payment method deletion
- [ ] Webhook setup (for later)

### 3. Frontend - Enterprise Profile UI (Week 2)

#### Layout & Navigation
- [ ] Dashboard layout with sidebar
- [ ] Enterprise profile navigation tabs
- [ ] Tenant switcher dropdown (placeholder for Phase 4)

#### Basic Info Tab
- [ ] Display current enterprise info
- [ ] Edit form (name, SIRET, KBIS)
- [ ] SIRET validation with INSEE API
- [ ] KBIS validation with INSEE API
- [ ] Activity domain dropdown (from admin)
- [ ] Speciality dropdown (filtered by activity)
- [ ] Real-time validation feedback

#### Address Tab
- [ ] Display current address
- [ ] Google Places autocomplete input
- [ ] Address form (street, city, postal code, country)
- [ ] Creation date display (read-only)

#### Marketing Tab
- [ ] Logo upload component
- [ ] Cover image upload component
- [ ] Image preview
- [ ] Image deletion
- [ ] File size/format validation

#### Documents Tab
- [ ] Documents list/table
- [ ] Document upload component
- [ ] Category selection
- [ ] Document download
- [ ] Document deletion
- [ ] File type validation

#### Subscription Tab
- [ ] Current plan display
- [ ] Plan features comparison
- [ ] Upgrade/downgrade buttons
- [ ] Payment methods list
- [ ] Add payment method (Stripe Elements)
- [ ] Remove payment method
- [ ] Invoices list with download
- [ ] Next payment date display

### 4. Testing & Integration (Week 3)

- [ ] Test all API endpoints
- [ ] Test file uploads (MinIO)
- [ ] Test INSEE API integration
- [ ] Test Google Places integration
- [ ] Test Stripe payment method flow
- [ ] Frontend-backend integration testing
- [ ] Error handling testing
- [ ] UI/UX polish

---

## 🚀 Recommended Starting Point

### Option 1: Start with Backend APIs (Recommended)
1. **Set up external API clients** (INSEE, Google Places, MinIO, Stripe)
2. **Build enterprise profile endpoints** (Basic Info first)
3. **Test APIs** with Postman/Swagger
4. **Then build frontend** to consume these APIs

### Option 2: Start with Frontend UI (Alternative)
1. **Build enterprise profile UI** (all tabs, mock data)
2. **Then connect to backend** APIs as they're built
3. **Iterate and refine**

---

## 📋 Immediate Next Steps (This Week)

### Priority 1: External API Setup
1. **INSEE API Client**
   - Get INSEE API key
   - Create service in User API
   - Implement SIRET validation

2. **Google Places API Client**
   - Get Google Places API key
   - Create service in User API
   - Implement autocomplete

3. **MinIO Setup**
   - Configure MinIO buckets
   - Create file upload service
   - Test file upload/download

### Priority 2: Enterprise Profile Backend
1. **Enterprise Module** in User API
   - Create enterprise controller
   - Create enterprise service
   - Create DTOs

2. **Basic Info Endpoints**
   - GET profile
   - PUT profile
   - POST validate-siret
   - GET activities/specialities

### Priority 3: Frontend Foundation
1. **Dashboard Layout**
   - Sidebar navigation
   - Tab navigation component
   - Enterprise profile route structure

2. **Basic Info Tab UI**
   - Form components
   - Validation
   - API integration

---

## 🔧 Technical Considerations

### File Upload Strategy
- Use MinIO for all file storage
- Implement multipart upload for large files
- Add file size limits (logo: 2MB, cover: 5MB, documents: 10MB)
- Support image formats: JPG, PNG, WebP
- Support document formats: PDF, DOCX, XLSX

### API Rate Limiting
- INSEE API: Check rate limits
- Google Places API: Check quota limits
- Implement caching for frequently accessed data

### Security
- Validate file types server-side
- Scan uploaded files for malware (future)
- Restrict file access by tenant
- Implement signed URLs for file downloads

---

## 📊 Success Criteria

Phase 3 is complete when:
- ✅ All enterprise profile tabs are functional
- ✅ SIRET/KBIS validation works with INSEE API
- ✅ Address autocomplete works with Google Places
- ✅ File uploads work (logo, cover, documents)
- ✅ Subscription management UI is functional
- ✅ Payment methods can be added/removed
- ✅ Invoices can be viewed and downloaded
- ✅ All APIs are documented in Swagger
- ✅ Frontend is responsive and polished

---

## 🎯 After Phase 3

**Phase 4: Multi-Tenant Features**
- Tenant switching functionality
- User invitations
- Role management
- Guest permissions

**Phase 5: Subscription & Payments**
- Stripe subscription management
- Payment processing
- Invoice generation
- Plan upgrades/downgrades

---

**Ready to start Phase 3?** 🚀
