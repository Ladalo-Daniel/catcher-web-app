import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useItems } from '@/hooks/use-items';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
    const location = useLocation();
  
   const {loading, addItem } = useItems();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredItem, setRegisteredItem] = useState<any>(null);
   const secretKey = 'sk_live_a824ac84b15085c0a50f228cde621e4fc2d60490'; 



  // const reference = searchParams.get('reference');

  // useEffect(() => {
  //   if (!reference) {
  //     setVerificationStatus('error');
  //     setErrorMessage('Payment reference not found');
  //     return;
  //   }

  //   verifyPayment(reference);
  // }, [reference]);

  
    // 🧠 Handle verification after redirect
    useEffect(() => {
      const query = new URLSearchParams(location.search);
      const reference = query.get('reference');
  
      if (reference) {
        verifyPayment(reference);
      }
    }, [location.search]);

   const verifyPayment = async (reference: string) => {
    setVerificationStatus('loading');
    setErrorMessage('');

    const transactionId = String(reference); // ✅ Safe!
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${transactionId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });

      const result = await response.json();

      if (!result.status) {
        throw new Error(result.message || 'Verification failed');
      }

      console.log("verification result", result);

      const { data } = result;

      if (data.status === 'success') {

       

        toast.success('Payment successful!');
        console.log("data", data);

         const itemData = typeof window !== "undefined" ? localStorage.getItem('itemData') : null;

        try {
           await addItem(itemData)
        } catch (error) {
          toast.error('Failed to register item: ' + error.message);
          console.log("erro:", error)
        }
        setVerificationStatus('success');
        setRegisteredItem(itemData);
        // navigate('/success'); // Or any confirmation page
        // Perform your success logic: store item, redirect, etc.
      } else {
        toast.error('Payment was not successful.');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error('Verification error:', error.message);
      toast.error('Failed to verify transaction.');
    } finally {
      setVerificationStatus('error');
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            {verificationStatus === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-primary" />
                <CardTitle>Verifying Payment...</CardTitle>
                <CardDescription>
                  Please wait while we verify your payment and register your item.
                </CardDescription>
              </>
            )}
            
            {verificationStatus === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <CardTitle className="text-green-700">Payment Successful!</CardTitle>
                <CardDescription>
                  Your item has been successfully registered in the Catcher registry.
                </CardDescription>
              </>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <CardTitle className="text-red-700">Payment Failed</CardTitle>
                <CardDescription>
                  {errorMessage || 'There was an issue processing your payment.'}
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            {verificationStatus === 'success' && registeredItem && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-green-800 mb-2">Item Registered:</h3>
                <p><strong>Name:</strong> {registeredItem.name}</p>
                <p><strong>Serial Number:</strong> {registeredItem.serial_number}</p>
                <p><strong>Category:</strong> {registeredItem.category}</p>
                <p><strong>Status:</strong> {registeredItem.status}</p>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              {verificationStatus === 'success' ? (
                <>
                  <Button asChild>
                    <Link to="/my-items">View My Items</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/register">Register Another Item</Link>
                  </Button>
                </>
              ) : verificationStatus === 'error' ? (
                <>
                  <Button asChild>
                    <Link to="/register">Try Again</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/">Go Home</Link>
                  </Button>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;