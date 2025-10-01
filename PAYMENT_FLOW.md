# Payment Flow - Frontend Documentation

## Overview
This document explains the complete payment flow from the frontend perspective, including how users initiate payments and how the callback page handles verification.

---

## 🔄 Complete Payment Flow

### 1. **User Initiates Payment**
```
User clicks "Enroll Now" or "Reserve Seat" button
  ↓
Frontend calls: POST /api/payments/initialize
  ↓
Backend creates Payment record (status=pending)
  ↓
Backend calls Paystack API
  ↓
Backend returns authorization_url
  ↓
Frontend redirects user to Paystack payment page
```

### 2. **User Completes Payment on Paystack**
```
User enters payment details on Paystack
  ↓
Payment processed by Paystack
  ↓
TWO things happen simultaneously:
  ├─ A) Paystack webhook → Backend (server-to-server)
  │    ↓
  │    Backend verifies payment
  │    ↓
  │    Creates Enrollment
  │    ↓
  │    Sends confirmation emails
  │
  └─ B) User redirected → Frontend callback page
       ↓
       /payments/callback?reference=PAY_xxx
```

### 3. **Callback Page Verifies Payment**
```
Callback page loads with reference parameter
  ↓
Calls: GET /api/payments/verify/{reference}
  ↓
Backend checks Payment status in database
  ↓
Returns payment details + enrollment status
  ↓
Frontend shows success/failure UI
  ↓
User clicks "Continue to Dashboard"
```

---

## 📁 Files Created

### `/app/payments/callback/page.tsx`
The payment callback page that handles Paystack redirects.

**Features:**
- ✅ Extracts payment reference from URL query parameters
- ✅ Verifies payment with backend API
- ✅ Shows beautiful success/failure UI
- ✅ Handles pending payments (auto-retry)
- ✅ Displays payment details and enrollment confirmation
- ✅ Redirects to dashboard after success
- ✅ Error handling with user-friendly messages

**States:**
- `verifying` - Initial state while checking payment
- `success` - Payment completed, enrollment created
- `failed` - Payment failed
- `error` - Verification error or system issue

### `/lib/config.ts`
Centralized API configuration for consistent endpoint usage.

**Features:**
- ✅ Single source of truth for API base URL
- ✅ Environment variable support (`NEXT_PUBLIC_API_URL`)
- ✅ Organized endpoint structure by category
- ✅ Type-safe endpoint functions

---

## 🎨 UI/UX Features

### Success Screen
- ✅ Animated success icon
- ✅ Course title and payment amount
- ✅ Payment reference for user records
- ✅ Payment date/time
- ✅ Lifetime access badge
- ✅ Email confirmation notice
- ✅ "Continue to Dashboard" CTA

### Failed Screen
- ✅ Clear failure message
- ✅ Payment reference for support
- ✅ "Try Again" button
- ✅ Alternative navigation options

### Error Screen
- ✅ Error details
- ✅ Support contact information
- ✅ "Retry Verification" option
- ✅ Dashboard fallback

### Verifying Screen
- ✅ Animated loading indicator
- ✅ Status message
- ✅ Auto-retry for pending payments

---

## 🔧 Usage Example

### In Course Card Component (Future Implementation)
```typescript
import { API_ENDPOINTS } from '@/lib/config';
import { fetchWithAuth } from '@/lib/api';

const handleEnrollClick = async (courseId: string) => {
  try {
    // Initialize payment
    const response = await fetchWithAuth(
      API_ENDPOINTS.payments.initialize,
      {
        method: 'POST',
        body: JSON.stringify({
          course_id: courseId,
          payment_method: 'card'
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;
    } else {
      // Handle error
      const error = await response.json();
      alert(error.error);
    }
  } catch (error) {
    console.error('Payment initialization failed:', error);
  }
};
```

---

## 📊 Payment States

| Status | Description | Frontend Action |
|--------|-------------|----------------|
| `pending` | Payment initiated, awaiting confirmation | Show loading, auto-retry after 3s |
| `completed` | Payment successful, enrollment created | Show success screen |
| `failed` | Payment unsuccessful | Show failure screen with retry option |
| `error` | System error during verification | Show error screen with support info |

---

## 🔐 Security

### Authentication
- All payment verification requests require JWT authentication
- Uses `fetchWithAuth` which handles token refresh automatically

### URL Parameters
- Accepts both `reference` and `trxref` parameters (Paystack sends both)
- No sensitive data in URL (only payment reference)

### Validation
- Backend performs all payment validation
- Frontend only displays results, doesn't modify payment state

---

## 🧪 Testing

### Test Flow (Development)
1. Start backend: `cd server && python run.py`
2. Start frontend: `cd client && npm run dev`
3. Login to application
4. Find a paid course (or create one as tutor)
5. Click "Enroll Now" or "Reserve Seat"
6. Use Paystack test card:
   - Card: `4084 0840 8408 4081`
   - Expiry: Any future date
   - CVV: `408`
   - PIN: `0000`
   - OTP: `123456`
7. Complete payment
8. You'll be redirected to `/payments/callback?reference=PAY_xxx`
9. Verify success screen shows

### Manual Callback URL Test
```
http://localhost:3000/payments/callback?reference=PAY_test_reference_123
```

---

## 🐛 Troubleshooting

### Issue: "No payment reference found in URL"
**Cause:** Callback URL missing reference parameter  
**Fix:** Check Paystack dashboard callback URL configuration

### Issue: "Payment completed but enrollment not created"
**Cause:** Webhook might not have processed yet  
**Fix:** Page auto-refreshes for pending payments. If persists, check webhook logs.

### Issue: Stuck on "Verifying Payment"
**Cause:** Backend API not responding or reference invalid  
**Fix:** 
1. Check backend is running
2. Check network tab for API errors
3. Verify payment reference exists in database

### Issue: Authentication errors
**Cause:** JWT token expired or invalid  
**Fix:** `fetchWithAuth` should handle this automatically. If persists, clear cookies and login again.

---

## 📈 Future Enhancements

### Potential Additions:
1. **Payment History Page**
   - View all past payments
   - Download receipts
   - Track enrollment status

2. **Failed Payment Recovery**
   - Resend webhook notification
   - Manual verification request
   - Support ticket creation

3. **Multi-Step Payment**
   - Payment plan options
   - Installment tracking
   - Auto-debit management

4. **Enhanced Analytics**
   - Track conversion rates
   - Monitor failed payments
   - Identify drop-off points

---

## 🔗 Related Files

### Backend
- `/server/services/paystack_service.py` - Paystack integration
- `/server/resources/payment_routes.py` - Payment API endpoints
- `/server/models/payment.py` - Payment model
- `/server/models/enrollment.py` - Enrollment model

### Frontend
- `/client/src/app/payments/callback/page.tsx` - This implementation
- `/client/src/lib/config.ts` - API configuration
- `/client/src/lib/api.ts` - Authenticated fetch wrapper

### Documentation
- `/server/PAYSTACK_WEBHOOK_SETUP.md` - Webhook setup guide
- `/server/PAYSTACK_QUICK_REFERENCE.md` - Quick reference
- `/server/PAYMENT_IMPLEMENTATION_COMPLETE.md` - Backend implementation

---

## 💡 Key Takeaways

1. **Callback URL ≠ Webhook URL**
   - Callback = User redirect (frontend)
   - Webhook = Server notification (backend)

2. **Two Verification Paths**
   - Webhook creates the enrollment (authoritative)
   - Callback page just displays the results

3. **Idempotent Operations**
   - Multiple verification requests are safe
   - Backend checks if enrollment already exists

4. **User Experience First**
   - Clear status messages
   - Auto-retry for pending payments
   - Beautiful success/failure screens
   - Always provide a way forward (CTA)

---

## 📞 Support

If you encounter issues:
1. Check backend logs: `tail -f server/logs/app.log`
2. Check browser console for errors
3. Verify Paystack dashboard configuration
4. Contact support with payment reference number
