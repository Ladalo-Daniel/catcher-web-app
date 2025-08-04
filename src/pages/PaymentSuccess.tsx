import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useItems } from '@/hooks/use-items';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
   const {loading, addItem } = useItems();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'verify' | 'success' | 'error'>('verify');
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredItem, setRegisteredItem] = useState<any>(null);
  const [itemData, setItemData] = useState<any>(null);
   const secretKey = 'sk_live_a824ac84b15085c0a50f228cde621e4fc2d60490'; 

   console.log("userrrr:", user)

   const reference = searchParams.get('trxref');


useEffect(() => {
  const itemDataRaw = localStorage.getItem('itemData');
  if (itemDataRaw) {
    setItemData(JSON.parse(itemDataRaw));
  }
}, []);



  
    // 🧠 Handle verification after redirect
    // useEffect(() => {
    //   if (reference && user && itemData) {
    //     verifyPayment(reference);
    //   }
    // }, [reference, user, itemData]);

  const verifyPayment = async (reference: string) => {
  setVerificationStatus('loading');``
  const transactionId = String(reference);

  console.log("transactionId:", transactionId);

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${transactionId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const result = await response.json();
    if (!result.status) throw new Error(result.message || 'Verification failed');

    const { data } = result;
    if (data.status === 'success') {
      toast.success('Payment successful!');

      // // 🧠 Check for user before using
      // if (!user) {
      //   toast.error('You must be logged in to register item!!!!!!.');
      //   // setVerificationStatus('error');
      //   return;
      // }


      if (!itemData) {
        toast.error('Item data is missing.');
        return;
      }

      try {
         await addItem(itemData, user); // ✅ Assuming this takes item and user
        setRegisteredItem(itemData);
        setVerificationStatus('success');
      } catch (error: any) {
        console.log("itemError:", error)
        toast.error('Failed to register item: ' + error.message);
      }
    } else {
      toast.error('Payment was not successful.');
      setVerificationStatus('error');
    }
  } catch (error: any) {
    setErrorMessage(error.message);
    toast.error('Failed to verify transaction.');
    setVerificationStatus('error');
  }
};


const handleVerifyPayment = () => {
  verifyPayment(reference)
}


  // if (!user) {
  //   return <Navigate to="/auth" replace />;
  // }

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
                  <Button onClick={() => setVerificationStatus('verify')}>
                    Try Again
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/">Go Home</Link>
                  </Button>
                </>
              ) : null}
            </div>

            <div className="flex gap-4 justify-center">
              {
                verificationStatus === "verify" &&
                <>
                <Button onClick={handleVerifyPayment} className=' p-6 rounded-xl hover:opacity-75'>
                   Click to Complete Item Upload!
                  </Button>
                </>
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;