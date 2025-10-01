'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

interface PaymentVerification {
  payment_id: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  course_id: string | null;
  course_title: string | null;
  paid_at: string | null;
  has_enrollment: boolean;
  enrollment_id: string | null;
}

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'error'>('verifying');
  const [payment, setPayment] = useState<PaymentVerification | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [shouldRetry, setShouldRetry] = useState(false);
  const MAX_RETRIES = 5; // Maximum 5 retries (15 seconds total)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get reference from URL query parameters
        const reference = searchParams.get('reference');
        const paystackReference = searchParams.get('trxref'); // Paystack also sends trxref
        
        const paymentReference = reference || paystackReference;

        if (!paymentReference) {
          setStatus('error');
          setErrorMessage('No payment reference found in URL');
          return;
        }

        console.log('Verifying payment:', paymentReference);
        console.log('Using API endpoint:', API_ENDPOINTS.payments.verify(paymentReference));

        // Call backend to verify payment
        const response = await fetchWithAuth(
          API_ENDPOINTS.payments.verify(paymentReference),
          {
            method: 'GET',
          }
        );

        console.log('Verification response status:', response.status);

        if (response.ok) {
          const data: PaymentVerification = await response.json();
          console.log('Payment verification data:', data);
          setPayment(data);

          if (data.status === 'completed' && data.has_enrollment) {
            setStatus('success');
            console.log('Payment verified successfully with enrollment');
          } else if (data.status === 'failed') {
            setStatus('failed');
            setErrorMessage('Payment was not successful');
            console.log('Payment failed');
          } else if (data.status === 'pending') {
            // Still pending - might need to wait for webhook
            console.log('Payment still pending, retry attempt:', retryCount + 1);
            
            if (retryCount < MAX_RETRIES) {
              setStatus('verifying');
              setErrorMessage(`Payment is being processed. Retry ${retryCount + 1}/${MAX_RETRIES}...`);
              
              // Schedule retry after 3 seconds
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
                setShouldRetry(true);
              }, 3000);
            } else {
              // Max retries reached
              setStatus('error');
              setErrorMessage('Payment verification is taking longer than expected. Your payment may still be processing. Please check your email or contact support if the issue persists.');
              console.log('Max retries reached for payment verification');
            }
          } else {
            setStatus('error');
            setErrorMessage('Payment completed but enrollment not created. Please contact support.');
            console.log('Payment in unexpected state:', data.status);
          }
        } else {
          // Parse error response
          let errorMessage = 'Failed to verify payment';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
            console.error('Verification failed with error:', errorData);
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            console.error('Response status:', response.status, response.statusText);
          }
          setStatus('error');
          setErrorMessage(errorMessage);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        
        // More detailed error logging
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          setErrorMessage(`Verification error: ${error.message}`);
        } else {
          setErrorMessage('An unexpected error occurred while verifying your payment');
        }
        
        setStatus('error');
      }
    };

    // Only verify on initial mount and when retry is triggered
    if (searchParams.get('reference') || searchParams.get('trxref')) {
      verifyPayment();
    }
    
    // Reset shouldRetry after verification
    if (shouldRetry) {
      setShouldRetry(false);
    }
  }, [searchParams, shouldRetry]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContinue = () => {
    if (status === 'success' && payment && payment.course_id) {
      // Redirect to the course page
      router.push(`/dashboard/courses/${payment.course_id}`);
    } else {
      // Fallback to dashboard if no course_id
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Verifying State */}
        {status === 'verifying' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Loader2 className="h-20 w-20 text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verifying Payment
            </h1>
            <p className="text-gray-600 mb-4">
              Please wait while we confirm your payment...
            </p>
            {errorMessage && (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                {errorMessage}
              </p>
            )}
          </div>
        )}

        {/* Success State */}
        {status === 'success' && payment && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-green-100 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Payment Successful! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Your enrollment has been confirmed
            </p>

            {/* Payment Details */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">Course</span>
                  <span className="text-sm font-semibold text-gray-900 text-right max-w-[200px]">
                    {payment.course_title}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Amount Paid</span>
                  <span className="text-lg font-bold text-green-600">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Reference</span>
                  <span className="text-xs font-mono text-gray-500">
                    {payment.reference}
                  </span>
                </div>
                {payment.paid_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Date</span>
                    <span className="text-sm text-gray-700">
                      {new Date(payment.paid_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enrollment Badge */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                ✓ You now have <strong>lifetime access</strong> to this course
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Go to Course
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="text-xs text-gray-500 mt-4">
              A confirmation email has been sent to your inbox
            </p>
          </div>
        )}

        {/* Failed State */}
        {status === 'failed' && payment && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="h-20 w-20 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              {errorMessage || 'Your payment was not successful'}
            </p>

            {/* Payment Details */}
            {payment.course_title && (
              <div className="bg-red-50 rounded-xl p-6 mb-6 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">Course</span>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-[200px]">
                      {payment.course_title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Reference</span>
                    <span className="text-xs font-mono text-gray-500">
                      {payment.reference}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <span className="text-sm font-semibold text-red-600 uppercase">
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Try Again
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="h-20 w-20 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verification Error
            </h1>
            <p className="text-gray-600 mb-6">
              {errorMessage}
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-800">
                If you believe this is an error, please contact our support team with your payment reference.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Retry Verification
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="h-20 w-20 text-blue-600 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Loading...</h1>
          <p className="text-gray-600">Please wait while we process your request.</p>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
